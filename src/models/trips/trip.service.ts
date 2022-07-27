import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Trip, TripDocument } from '../Trips/Trip.schema';
import { TripDetails } from '../trips/interface/trips-details.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { UserService } from '../users/user.service';

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
      destination: 'for implement, obtain location.',
      origen: 'for implement, obtain location.',
      checkIn: trip.checkIn,
      checkOut: trip.checkOut,
      kilometros: 80,
      peopleCapacity: 4,
      status: trip.status
    };
  }

  async findTripsByDriver(driverId: string): Promise<TripDocument[]> {
    return this.tripModel.find({ driverId }).exec();
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

  async create( trip: NewTripDTO ): Promise<TripDocument> {

    const user = await this.userService.findByEmail(trip.driverEmail)
    
    const newTrip = new this.tripModel(
    { 
      originId: trip.origin,
      destinationId: trip.destination,
      peopleCapacity: trip.peopleCapacity,
      driverId: user._id,
      checkOut: trip.checkOut,
      checkIn: trip.checkIn,
      status: trip.status
    });

    return newTrip.save();
  }

  async update(
    trip: TripDocument
  ): Promise<TripDocument> {
    return trip.save();
  }
}
