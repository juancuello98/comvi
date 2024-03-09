import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripStatus } from './enums/state.enum';
import { Trip, TripDocument } from './trip.schema';

export class TripRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
  ) {}
  async findByDriver(driver: string): Promise<TripDocument[]> {
    const trips = await this.tripModel
      .find({ driver })
      .sort({ createdTimestamp: 'desc' })
      .exec();
    return trips;
  }

  async find(field: any): Promise<TripDocument[]> {
    return await this.tripModel.find(field).exec();
  }

  async findNonDriverTrips(email: string) {
    return await this.tripModel.find({ driver: { $ne: email } });
  }

  async create(trip: NewTripDTO) {
    const newTrip = new this.tripModel({
      ...trip,
      placesAvailable: trip.peopleQuantity,
      status: TripStatus.OPEN,
      createdTimestamp: new Date().toISOString(),
    });

    const tripCreated = await newTrip.save();

    return tripCreated;
  }

  async update(trip: TripDocument) {
    return await trip.save()
  }

  async findByIdAndDriver(driver: string, _id:string) : Promise<TripDocument> {
    const filter = {
        driver,
        _id,
      };

    const hasUserTrip = await this.tripModel.findOne(filter);

    return hasUserTrip;
  }
}
