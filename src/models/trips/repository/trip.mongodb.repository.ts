
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewTripDTO } from '../dto/new-trip.dto';
import { TripStatus } from '../enums/state.enum';
import { Trip, TripDocument } from '../trip.schema';
import { ITripRepository } from '../interface/trip.repository.interface';
import { User, UserDocument } from '@/users/user.schema';
import { Request, RequestDocument } from '../../requests/request.schema';

export class TripMongodbRepository implements ITripRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
  ) {}

  async findByDriver(driver: string): Promise<Trip[]> {

    const trips = await this.tripModel
      .find({ driver })
      .sort({ createdTimestamp: 'desc' })
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .select('-__v -_id')
      .exec();
    return trips;
  }

  async find(field: any): Promise<Trip[]> {
    return await this.tripModel.find(field).select('-__v -_id').exec();
  }

  async findByIdWithDriver(id: any): Promise<any> {
    const trip = await this.tripModel.findOne({id})
    .select('-__v -_id')
    .populate('vehicle')
    .populate('origin')
    .populate('destination')
    .select('-__v -_id')
    .lean().exec();
    const fields = ['email','name','lastname'];
    const driver = await this.userModel.findOne({email: trip.driver}).select(fields.join(' ')).exec();
    return {...trip,driver};
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripModel.findOne({id})
    .populate('vehicle')
    .populate('origin')
    .populate('destination')
    .select('-__v -_id')
    .exec();

    if (trip && trip.acceptedRequests && trip.acceptedRequests.length > 0) {
      try {
        // Obtener las requests aceptadas con toda la información
        const acceptedRequests = await this.requestModel
          .find({ _id: { $in: trip.acceptedRequests } })
          .select('email totalPassenger hasEquipment hasPartner createdTimestamp status')
          .exec();

        if (acceptedRequests.length > 0) {
          // Obtener los emails únicos de los usuarios
          const userEmails = [...new Set(acceptedRequests.map(request => request.email))];
          
          // Obtener la información de los usuarios
          const users = await this.userModel
            .find({ email: { $in: userEmails } })
            .select('name lastname email')
            .exec();

          // Crear un mapa de usuarios por email para acceso rápido
          const userMap = new Map(users.map(user => [user.email, user]));

          // Mapear la información completa de las requests con los datos de usuarios
          const passengers = acceptedRequests.map(request => {
            const user = userMap.get(request.email);
            return {
              requestId: request._id,
              name: user ? user.name : '',
              lastname: user ? user.lastname : '',
              email: request.email,
              totalPassenger: request.totalPassenger,
              hasEquipment: request.hasEquipment,
              hasPartner: request.hasPartner,
              createdTimestamp: request.createdTimestamp,
              status: request.status
            };
          });

          // Crear un nuevo objeto trip con los datos modificados
          const tripWithPassengers = {
            ...trip.toObject(),
            acceptedRequests: passengers
          } as any;
          
          return tripWithPassengers;
        }
      } catch (error) {
        console.error('Error processing acceptedRequests:', error);
        // Si hay error, mantener los IDs originales
      }
    }

    return trip;
  }

  async findNonDriverTrips(email: string) {
    return await this.tripModel
    .find({ driver: { $ne: email } })
    .select('-__v -_id')
    .populate('vehicle')
    .populate('origin')
    .populate('destination')
    .select('-__v -_id')
    .exec();
  }

  async findByPassenger(passengerEmail: string): Promise<Trip[]> {
    // Buscar requests aceptadas del pasajero
    const acceptedRequests = await this.requestModel
      .find({ email: passengerEmail, status: 'ACCEPTED' })
      .select('tripId')
      .exec();
    
    if (!acceptedRequests.length) {
      return [];
    }

    const tripIds = acceptedRequests.map(request => request.tripId);

    return await this.tripModel
      .find({ id: { $in: tripIds } })
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .populate('acceptedRequests')
      .select('-__v -_id')
      .sort({ createdTimestamp: 'desc' })
      .exec();
  }

  async create(trip: NewTripDTO) {
    return await this.tripModel
    .create(trip);
  }

  async update(trip: TripDocument): Promise<Trip> {
    const { _id, ...rest } = trip.toObject ? trip.toObject() : trip;
    await this.tripModel.updateOne({ _id }, { $set: rest }).exec();
    return await this.tripModel.findById(_id).exec();
  }

  async updateStatus(id: string, newStatus: TripStatus) {
    try {
      // Solo actualizar el status, sin tocar otros campos
      const result = await this.tripModel.updateOne(
        { id: id },
        { $set: { status: newStatus } }
      ).exec();

      if (result.matchedCount === 0) {
        throw new Error('Trip not found');
      }

      // Retornar el trip actualizado
      const updatedTrip = await this.tripModel.findOne({ id: id }).exec();
      return updatedTrip;
    } catch (error) {
      throw new Error(`Failed to update trip status: ${error.message}`);
    }
  }

  async findByIdAndDriver(driver: string, id: string): Promise<any> {
    const filter = {
      driver,
      id,
    };

    const hasUserTrip = await this.tripModel.findOne(filter).exec();

    return hasUserTrip;
  }

  async passengersByTrip(
    id: string,
  ): Promise<any> {
    try {
      const acceptedRequests = await this.requestModel
        .find({ tripId: id, status: 'ACCEPTED' })
        .exec();

      if (!acceptedRequests.length) {
        return null;
      }

      const passengerEmails = acceptedRequests.map(request => request.email);
      const passengers = await this.userModel
        .find({ email: { $in: passengerEmails } })
        .select('name lastname email')
        .exec();

      return passengers;
    } catch (error) {
      throw new Error('Error finding passengers: ' + error.message);
    }
  }
}
