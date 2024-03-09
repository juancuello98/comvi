import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { Trip, TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { TripStatus } from './enums/state.enum';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { TripResume, TripResumeDocument } from '../reviews/trips-resume.schema';
import { todayDateWithFormat } from 'src/common/helpers/date/date.helper';
import { User, UserDocument } from '../users/user.schema';
import { GetUserDTO } from '../users/dto/user.dto';
import { randomInt } from 'crypto';
import { TripRepository } from './trip.repository';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    private readonly tripRepository: TripRepository,
    private readonly responseHelper: ResponseHelper,
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
      let trip = await this.tripModel.findById(tripId).exec();
      if (!trip) {
        trip = null;
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
      }

      let user = await this.userService.getUser();
      user = this.userWraped(user);

      const tripWrapped = this._tripDetails(trip, user);

      return this.responseHelper.makeResponse(
        false,
        message,
        tripWrapped,
        status,
      );
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
    const trip = await this.tripRepository.findByIdAndDriver(driver,id);

    if (!trip){
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${driver}.`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    if (trip.status !== TripStatus.OPEN) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status}.`,
        null,
        HttpStatus.OK,
      );
    }

    if (trip.passengers.length === 0) {
      return this.responseHelper.makeResponse(
        false,
        `Your trip does not contain passengers: ${trip.passengers.length}`,
        null,
        HttpStatus.OK,
      );
    }

    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = new Date().toISOString();

    const newTripResume = new this.tripResumeModel({
      passengers: trip.passengers,
      fechaHoraRealInicio: new Date().toISOString(),
    });

    newTripResume.save();

    this.logger.log(`Create new trip resume with id ${newTripResume.id}`);

    hasUserTrip.tripResumeId = newTripResume.id;

    const tripUpdated = hasUserTrip.save();

    this.logger.log(`Update trip status to ${hasUserTrip.status}`);

    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      tripUpdated,
      HttpStatus.OK,
    );
  }

  async finish(id: string, userEmail: string): Promise<ResponseDTO> {
    this.logger.log('Initialize process to finish trip...');

    const filter = {
      driverEmail: userEmail,
      _id: id,
    };

    const hasUserTrip = await this.tripModel.findOne(filter);

    if (!hasUserTrip)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${userEmail}`,
        null,
        HttpStatus.NOT_FOUND,
      );

    if (hasUserTrip.status !== TripStatus.IN_PROGRESS) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status: ${hasUserTrip.status}`,
        null,
        HttpStatus.OK,
      );
    }

    hasUserTrip.status = TripStatus.FINISHED;

    const tripUpdated = hasUserTrip.save();

    this.logger.log(`Update trip status to ${hasUserTrip.status}`);

    const _filter = { _id: hasUserTrip.tripResumeId };
    const update = { fechaHoraRealFin: new Date().toISOString() };

    const tripResume = await this.tripResumeModel.findOneAndUpdate(
      _filter,
      update,
    );

    tripResume.save();

    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully finished : ${id}`,
      tripUpdated,
      HttpStatus.OK,
    );
  }

  async listOfPassengers(tripId: string): Promise<ResponseDTO> {
    try {
      let message = 'Passengers inside the trip.';
      let status = HttpStatus.OK;

      const trip = await this.tripModel.findOne({ _id: tripId }).exec();

      if (!trip) {
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
        return this.responseHelper.makeResponse(false, message, null, status);
      }

      const passengersOfTrip = await this.userModel
        .find()
        .where('_id')
        .in(trip.passengers);
      const resp = passengersOfTrip.map((x) => this.userWraped(x));
      return this.responseHelper.makeResponse(false, message, resp, status);
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

  userWraped(user: UserDocument): any {
    return {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      quantityReviews: randomInt(3, 8),
      averageRating: randomInt(1, 5),
      identityHasVerified: true,
    };
  }

  _tripDetails(trip: TripDocument, driver: any): any {
    return {
      _id: trip.id,
      allowPackage: trip.allowPackage,
      allowPassenger: trip.allowPassenger,
      createdTimestamp: trip.createdTimestamp,
      description: trip.description,
      destination: trip.destination,
      origin: trip.origin,
      paquetes: trip.paquetes,
      passengers: trip.passengers,
      peopleQuantity: trip.peopleQuantity,
      placesAvailable: trip.placesAvailable,
      startedTimestamp: trip.startedTimestamp,
      status: trip.status,
      tripsRequests: trip.tripsRequests,
      valuations: trip.valuations,
      vehicle: trip.vehicle,
      driver: driver,
    };
  }

  async updateTripRequests(
    tripId: string,
    requestId: string,
  ): Promise<Trip & TripDocument> {
    const update = { $push: { tripsRequests: requestId } };

    const trip = await this.tripModel.findByIdAndUpdate(tripId, update);

    if (!trip) return trip;

    this.logger.log(
      'updateTripRequests: Trip updated when new request in tripsRequests.',
    );

    return await trip.save();
  }
}
