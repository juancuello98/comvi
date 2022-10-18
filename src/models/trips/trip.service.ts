import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripDetails } from '../trips/interface/trips-details.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { UserService } from '../users/user.service';
import { Trip, TripDocument } from './trip.schema';
import { randomInt } from 'crypto';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { TripStatus } from './enums/state.enum';

@Injectable()
export class TripService {

  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly userService: UserService,
  ) {}

  _getTripDetails(trip: TripDocument): TripDetails {
    return {
      id: trip._id,
      destination: trip.destination,
      origen: trip.origin,
      checkIn: trip.checkIn,
      kilometros: randomInt(248),
      peopleCapacity: trip.peopleQuantity,
      status: trip.status
    };
  }

  async findTripsByDriver(driverEmail: string): Promise<ResponseDTO> {
    console.log(driverEmail);
    const trips = await this.tripModel.find({driverEmail}).exec();
    return {
      hasError: false,
      message: 'User trips found.',
      data: {trips},
      status: HttpStatus.OK
    }
  }

  async findByStatus(status: string): Promise<TripDocument[]> {
    return this.tripModel.find({status}).exec();
  }

  async findAll(): Promise<TripDocument[] | null> {
    const items = await this.tripModel.find().exec();
    if(items.length == 0) return null;
    return items;
    
  }

  async findById(tripId: string): Promise<TripDetails | null> {
    const trip = await this.tripModel.findById(tripId).exec();
    if (!trip) return null;
    return this._getTripDetails(trip);
  }

  async create( trip: NewTripDTO ): Promise<ResponseDTO> {

    const newTrip = new this.tripModel(
    { 
      driverEmail: trip.email,
      origin: trip.origin,
      destination: trip.destination,
      allowPackage: trip.allowPackage,
      allowPassenger: trip.allowPassenger,
      peopleQuantity: trip.peopleQuantity,
      vehicle: trip.vehicle,
      checkIn: trip.startedTimestamp,
      status: TripStatus.OPEN,
      createdTimestamp: Date.now().toString()
    });

    const tripCreated = await newTrip.save();

    const resp : ResponseDTO = {
      hasError: false,
      message: 'Trip was created succesfully.',
      data: tripCreated,
      status: HttpStatus.CREATED

    }

    return resp;
  }

  async update(
    trip: TripDocument
  ): Promise<TripDocument> {
    return trip.save();
  }
}
