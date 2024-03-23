import {
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserService } from '@/users/user.service';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { TripDocument } from './trip.schema';
import { TripStatus } from './enums/state.enum';
import { TripRepository } from './trip.repository';
import { TripResumeRepository } from './resumes/trip.resume.repository';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripDTO } from './dto/existing-trip.dto';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @Inject(TripRepository) private readonly tripRepository: TripRepository,
    @Inject(TripResumeRepository)
    private readonly tripResumeRepository: TripResumeRepository,
    @Inject(UserService) readonly userService: UserService,
    @Inject(ResponseHelper) readonly responseHelper: ResponseHelper,
  ) {}

  async findByDriver(driver: string): Promise<TripDocument[]> {
    const trips = this.tripRepository.findByDriver(driver);
    this.logger.log(`Trips of user ${driver} founded. STATUS: SUCCESS`);
    return trips;
  }

  async findByStatus(status: string): Promise<TripDocument[]> {
    return this.tripRepository.find({ status });
  }

  async findNonDriverTrips(email: string): Promise<ResponseDTO> {
    let items = [];

    if (!email) {
      items = await this.tripRepository.findNonDriverTrips(email);
    } else {
      items = await this.tripRepository.find({ status: TripStatus.OPEN });
    }

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

      const driver = (await this.userService.getUserData(trip.driver)).data;
      const tripData: TripDTO = {
        ...trip,
        driver,
      };

      return this.responseHelper.makeResponse(false, message, tripData, status);
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
    const newTrip = await this.tripRepository.create(trip);
    const message = 'Trip was created succesfully.';
    return this.responseHelper.makeResponse(
      false,
      message,
      newTrip,
      HttpStatus.CREATED,
    );
  }

  async update(trip: TripDocument): Promise<TripDocument> {
    return this.tripRepository.update(trip);
  }

  async cancel(id: string, driver: string): Promise<ResponseDTO> {
    const trip = await this.tripRepository.findByIdAndDriver(driver, id);

    if (!trip)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${driver}`,
        null,
        HttpStatus.NOT_FOUND,
      );

    if (trip.status !== TripStatus.OPEN) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status: ${trip.status}`,
        null,
        HttpStatus.OK,
      );
    }

    try {
      trip.status = TripStatus.CANCELED;
      const tripUpdated = await this.tripRepository.update(trip);

      this.logger.log(`Updated trip status to ${tripUpdated.status}.`);

      return this.responseHelper.makeResponse(
        false,
        `Trip successfully cancelled : ${id}.`,
        tripUpdated,
        HttpStatus.OK,
      );
    } catch (error) {
      throw error;
    }
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
      trip.status !== TripStatus.OPEN ||
      trip.passengers.length ||
      trip.paquetes.length
    ) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status} or not contain passengers and packages.`,
        null,
        HttpStatus.OK,
      );
    }

    const resume = await this.tripResumeRepository.create({
      passengers: trip.passengers,
      startedTimestamp: new Date().toISOString(),
    });

    const resumeId = resume.id;

    this.logger.log(`Trip resume created with id ${resumeId}`);

    trip.tripResumeId = resumeId;
    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = date;

    const status = (await this.tripRepository.update(trip)).status;
    this.logger.log(`Trip updated with status ${status}`);

    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async finish(id: string, userEmail: string): Promise<ResponseDTO> {
    this.logger.log('Initialize process to finish trip...');

    const trip = await this.tripRepository.findById(id);

    if (!trip || trip.status !== TripStatus.IN_PROGRESS)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${userEmail} or status ${trip.status} not is IN PROGRESS.`,
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

    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully finished : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async listOfPassengers(tripId: string): Promise<ResponseDTO> {
    try {
      let message = 'Passengers inside the trip.';
      let status = HttpStatus.OK;

      const trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
        return this.responseHelper.makeResponse(false, message, null, status);
      }

      const passengers = await this.tripRepository.findPassengers(
        trip.passengers,
        ['name', 'lastName', 'email'],
      );

      return this.responseHelper.makeResponse(
        false,
        message,
        passengers,
        status,
      );
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in listWithPassengers.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
