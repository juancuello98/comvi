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
import { IUserRepository } from '@/users/interfaces/user.repository.interface';
import { IUSER_REPOSITORY } from '@/users/repository/constants/user.repository.constant';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ITRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    private readonly tripResumeRepository: TripResumeRepository,
    private readonly responseHelper: ResponseHelper,
    private readonly locationService: LocationService,
  ) { }

  async findByDriver(driver: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByDriver(driver);

    if (!trips.length) {
      this.logger.log(`Trips of user ${driver} not founded.`);
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.log(`Trips of user ${driver} founded.`);

    return this.responseHelper.makeResponse(
      false,
      'Trip founded.',
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

  async findAll(): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findAll();
    if (!trips.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips founded.',
      trips,
      HttpStatus.OK,
    );
  }

  async findNonDriverTrips(email: string): Promise<ResponseDTO> {
    const items = await this.tripRepository.findNonDriverTrips(email);
    if (!items.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips founded.',
      items,
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
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(trip: NewTripDTO): Promise<ResponseDTO> {
    try {
      const driver = (await this.userRepository.findByEmail(trip.driver))._id;
      const origin = (await this.locationService.create((trip.origin as Location))).id;
      const destination = (await this.locationService.create(trip.destination as Location)).id;
      const id = uuidv4();
      const status = TripStatus.OPEN;
      const placesAvailable = trip.peopleQuantity;
      const createdTimestamp = new Date().toISOString();
      const input = Object.assign(trip, { id, origin, destination, status, placesAvailable, createdTimestamp, driver });

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
        "Error in create trip",
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
    
      return this.responseHelper.makeResponse(false,'Trip was cancelled.',null,HttpStatus.OK)
  }

  async init(id: string, driver: string): Promise<ResponseDTO> { //TODO: Refactorizar esto
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
      trip.status !== TripStatus.OPEN || trip.bookings.length
    ) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status} or not contain bookings or packages.`,
        null,
        HttpStatus.OK,
      );
    }

    const resume = await this.tripResumeRepository.create(
      { passengers: trip.bookings,
        valuations: [],
       }
    );

    const resumeId = resume.id;

    this.logger.log(`Trip resume created with id ${resumeId}`);

    trip.tripResumeId = resumeId;
    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = date;

    const updated = await this.tripRepository.update(trip);

    this.logger.log(`Trip updated with status ${updated.status}`);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async finish(id: string, driver: string): Promise<ResponseDTO> {
    this.logger.log('Initialize process to finish trip...');

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

    this.logger.log(`Trip status updated to ${status}`);

    const resume = await this.tripResumeRepository.findById(trip.tripResumeId);
    resume.endedTimestamp = new Date().toISOString();
    const resumeId = (await this.tripResumeRepository.update(resume)).id;

    this.logger.log(`Trip resume ${resumeId} updated.`);

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
      if(!passengers) return this.responseHelper.makeResponse(
        false,
        'Not found passengers in the trip.',
        passengers,
        HttpStatus.NOT_FOUND,
      );
      return this.responseHelper.makeResponse(
        false,
        'Passengers founded by trip.',
        passengers,
        HttpStatus.OK,
      );
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in listWithPassengers.',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
