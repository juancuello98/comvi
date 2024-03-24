import { User, UserDocument } from '@/users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripStatus } from './enums/state.enum';
import { Trip, TripDocument } from './trip.schema';

export class TripRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async findById(id: any): Promise<TripDocument | any> {
    const trip = this.tripModel.findById(id).select('-__v').populate('driver').exec();
    return trip;
  }

  async findNonDriverTrips(email: string) {
    return await this.tripModel.find({ driver: { $ne: email } });
  }

  async create(trip: NewTripDTO) {
    const status = TripStatus.OPEN;
    const placesAvailable = trip.peopleQuantity;
    const createdTimestamp = new Date().toISOString();
    const newTrip = await this.tripModel.create({
      ...trip,
      status,
      placesAvailable,
      createdTimestamp,
    });

    return newTrip;
  }

  async update(trip: TripDocument) {
    const tripUpdated = await trip.save();
    return tripUpdated;
  }

  async findByIdAndDriver(driver: string, _id: string): Promise<TripDocument> {
    const filter = {
      driver,
      _id,
    };

    const hasUserTrip = await this.tripModel.findOne(filter);

    return hasUserTrip;
  }

  async findPassengers(
    passengerIds: string[],
    fieldsToSelect: string[],
  ): Promise<any[]> {
    try {
      const passengers = await this.userModel
        .find({ _id: { $in: passengerIds } })
        .select(fieldsToSelect.join(' '));

      return passengers;
    } catch (error) {
      throw new Error('Error al buscar pasajeros: ' + error.message);
    }
  }
}
