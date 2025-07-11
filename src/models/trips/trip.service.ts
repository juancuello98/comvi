import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { Trip } from './trip.schema';
import { TripStatus } from './enums/state.enum';
import { TripResumeRepository } from './resumes/trip.resume.repository';
import { NewTripDTO } from './dto/new-trip.dto';
import { v4 as uuidv4 } from 'uuid';
import { ITripRepository } from './interface/trip.repository.interface';
import { ITRIP_REPOSITORY } from './repository/constants/trip.repository.constant';
import { ResponseHelper } from '@/common/helpers/http/response.helper';
import { LocationService } from '../locations/location.service';
import { Location } from '@/locations/location-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, RequestDocument } from '../requests/request.schema';
import { StatusRequest } from '../requests/enums/status.enum';


@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @Inject(ITRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    private readonly tripResumeRepository: TripResumeRepository,
    private readonly responseHelper: ResponseHelper,
    private readonly locationService: LocationService,
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,

  ) { }

  async findByDriver(driver: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByDriver(driver);

    if (!trips.length) {
      return this.responseHelper.makeResponse(
        false,
        'No published trips found.',
        [],
        HttpStatus.OK,
      );
    }

    return this.responseHelper.makeResponse(
      false,
      'Published trips found successfully.',
      trips,
      HttpStatus.OK,
    );
  }

  async findByStatus(status: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.find({ status });
    if (!trips.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trip founded.',
      trips,
      HttpStatus.OK,
    );
  }

  async findNonDriverTrips(email: string): Promise<ResponseDTO> {
    const items = await this.tripRepository.findNonDriverTrips(email);
    if (!items.length)
      return this.responseHelper.makeResponse(
        false,
        'No trips available.',
        [],
        HttpStatus.OK,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips found successfully.',
      items,
      HttpStatus.OK,
    );
  }

  async findByPassenger(passengerEmail: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByPassenger(passengerEmail);
    
    if (!trips.length) {
      return this.responseHelper.makeResponse(
        false,
        'No trips found where you are a passenger.',
        [],
        HttpStatus.OK,
      );
    }

    return this.responseHelper.makeResponse(
      false,
      'Trips where you are a passenger found successfully.',
      trips,
      HttpStatus.OK,
    );
  }

  async findById(tripId: string): Promise<ResponseDTO> {
    try {
      let message = 'Successfully found trips';
      let status = HttpStatus.OK;

      let trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        trip = null;
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
        return this.responseHelper.makeResponse(false, message, {}, status);
      }

      return this.responseHelper.makeResponse(false, message,trip, status);
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in findById',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(trip: NewTripDTO): Promise<ResponseDTO> {
    try {
      const origin = (await this.locationService.create((trip.origin as Location))).id;
      const destination = (await this.locationService.create(trip.destination as Location)).id;
      const id = uuidv4();
      const status = TripStatus.OPEN;
      const placesAvailable = trip.peopleQuantity;
      const createdTimestamp = new Date().toISOString();
      const input = Object.assign(trip, { 
        id, 
        origin, 
        destination, 
        status, 
        placesAvailable, 
        createdTimestamp,
        acceptedRequests: [],
        tripsRequests: [],
        valuations: []
      });

      const newTrip = await this.tripRepository.create(input);
      const message = 'Trip was created succesfully.';
      return this.responseHelper.makeResponse(
        false,
        message,
        newTrip,
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.responseHelper.makeResponse(
        false,
        error.message,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(trip: Trip): Promise<Trip> {
    return this.tripRepository.update(trip);
  }

  async cancel(id: string): Promise<ResponseDTO> {
    const trip = await this.tripRepository.updateStatus(id, TripStatus.CANCELED);

    if (!trip || trip.status !== TripStatus.CANCELED)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip or update failed.`,
        null,
        HttpStatus.NOT_FOUND,
      );

    try {
      const allRequests = await this.requestModel.find({
        tripId: id,
        status: { $in: [StatusRequest.ON_HOLD, StatusRequest.ACCEPTED] }
      }).exec();

      if (allRequests.length > 0) {
        await this.requestModel.updateMany(
          { tripId: id, status: { $in: [StatusRequest.ON_HOLD, StatusRequest.ACCEPTED] } },
          { status: StatusRequest.REJECTED }
        ).exec();
      }
    } catch (error) {
      this.logger.error(`Error rejecting requests for trip ${id}: ${error.message}`);
    }
    
    return this.responseHelper.makeResponse(false,'Trip was cancelled.',null,HttpStatus.OK)
  }

  async init(id: string, driver: string): Promise<ResponseDTO> {
    const date = new Date().toISOString();
    const trip = await this.tripRepository.findByIdAndDriver(driver, id);

    if (!trip) {
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${driver}.`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    
    if (
      trip.status !== TripStatus.OPEN || (trip.acceptedRequests && trip.acceptedRequests.length)
    ) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status} or not contain accepted requests or packages.`,
        null,
        HttpStatus.OK,
      );
    }

    const resume = await this.tripResumeRepository.create({
      passengers: trip.acceptedRequests || []
    });

    const resumeId = resume.id;

    trip.tripResumeId = resumeId;
    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = date;

    const updated = await this.tripRepository.update(trip);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async finish(id: string, driver: string): Promise<ResponseDTO> {
    const trip = await this.tripRepository.findByIdAndDriver(driver, id);

    if (!trip || trip.status !== TripStatus.IN_PROGRESS)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip or status not is IN PROGRESS.`,
        null,
        HttpStatus.NOT_FOUND,
      );

    trip.status = TripStatus.FINISHED;

    const status = (await this.tripRepository.update(trip)).status;

    const resume = await this.tripResumeRepository.findById(trip.tripResumeId);
    resume.endedTimestamp = new Date().toISOString();
    const resumeId = (await this.tripResumeRepository.update(resume)).id;

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully finished : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async listOfPassengers(id: string): Promise<ResponseDTO> {
    try {
      const passengers = await this.tripRepository.passengersByTrip(id);
      
      if (!passengers || passengers.length === 0) {
        return this.responseHelper.makeResponse(
          false,
          'Not found passengers in the trip.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      
      return this.responseHelper.makeResponse(
        false,
        'Passengers founded by trip.',
        passengers,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error in listOfPassengers: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error retrieving passengers for the trip.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
