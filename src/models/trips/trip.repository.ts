import { User, UserDocument } from '@/users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
      .select('-__v')
      .exec();
    return trips;
  }

  async find(field: any): Promise<TripDocument[]> {
    return await this.tripModel.find(field).exec();
  }

  async findByIdWithDriver(id: any): Promise<any> {
    const trip = await this.tripModel.findById(id).select('-__v').lean().exec();
    const fields = ['email','name','lastname'];
    const driver = await this.userModel.findOne({email: trip.driver}).select(fields.join(' ')).exec();
    return {...trip,driver};
  }

  async findById(id: string): Promise<any> {
    const trip = await this.tripModel.findById(id).select('-__v').exec();
    return trip;
  }

  async findNonDriverTrips(email: string) {
    return await this.tripModel.find({ driver: { $ne: email } }).select('-__v').exec();
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

  async updateStatus(tripId: string, newStatus: TripStatus) {
    try {
      // Buscar el viaje por su ID
      const trip = await this.tripModel.findById(tripId);

      if (!trip) {
        throw new Error('Trip not found');
      }

      // Actualizar el campo status
      trip.status = newStatus;

      // Guardar los cambios en la base de datos
      const updatedTrip = await trip.save();

      return updatedTrip;
    } catch (error) {
      throw new Error(`Failed to update trip status: ${error.message}`);
    }
  }

  async findByIdAndDriver(driver: string, _id: string): Promise<any> {
    const filter = {
      driver,
      _id,
    };

    const hasUserTrip = await this.tripModel.findOne(filter).lean().exec();

    return hasUserTrip;
  }

  async passengersByTrip(
    id: string,
  ): Promise<any> {
    try {
      const trip = this.tripModel
      .findOne({id})
      .populate({
        path: 'passengers',
        select: 'name lastname email -_id'}
      )
      .exec();

      return trip;
    } catch (error) {
      throw new Error('Error al buscar pasajeros: ' + error.message);
    }
  }
}
