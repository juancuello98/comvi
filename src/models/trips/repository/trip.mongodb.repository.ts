
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
  async update(trip: Trip): Promise<Trip> {
    const updatedTrip = await this.tripModel
      .findOneAndUpdate(
        { id: trip.id },
        trip,
        { new: true } // Retornar el documento actualizado
      )
      .lean() // Retornar objeto plano
      .exec();
    
    if (!updatedTrip) {
      throw new Error(`Trip with id ${trip.id} not found`);
    }
    
    return updatedTrip as Trip;
  }

  async updateStatus(tripId: string, newStatus: TripStatus): Promise<Trip> {
    const updatedTrip = await this.tripModel
      .findOneAndUpdate(
        { id: tripId },
        { status: newStatus },
        { new: true } // Retornar el documento actualizado
      )
      .lean() // Retornar objeto plano
      .exec();
    
    if (!updatedTrip) {
      throw new Error(`Trip with id ${tripId} not found`);
    }
    
    return updatedTrip as Trip;
  }

  async findByDriver(driver: string): Promise<Trip[]> {
    const trips = await this.tripModel
      .find({ driver })
      .sort({ createdTimestamp: 'desc' })
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .lean() // Retornar objeto plano
      .exec();
    return trips as Trip[];
  }

  async find(field: any): Promise<Trip[]> {
    const trips = await this.tripModel.find(field)
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .populate('requests')
      .populate('driver', 'email name lastname')
      .sort({ createdTimestamp: 'desc' })
      .select('-__v -_id')
      .lean() // Retornar objeto plano
      .exec();
    return trips as Trip[];
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
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .populate('requests')
      .populate('driver', 'email name lastname')
      .lean() // Retornar objeto plano
      .exec();

    return trip as Trip;
  }

  async findByIdWithRequests(id: string): Promise<Trip> {
    const trip = await this.tripModel.findOne({id})
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .lean() // Retornar objeto plano
      .exec();

    if (trip && trip.acceptedRequests && trip.acceptedRequests.length > 0) {
      try {
        // Obtener las requests aceptadas con toda la información
        const acceptedRequests = await this.requestModel
          .find({ _id: { $in: trip.acceptedRequests as any } })
          .select('email totalPassenger hasEquipment hasPartner createdTimestamp status')
          .lean() // Retornar objetos planos
          .exec();

        if (acceptedRequests.length > 0) {
          // Obtener los emails únicos de los usuarios
          const userEmails = [...new Set(acceptedRequests.map(request => request.email))];
          
          // Obtener la información de los usuarios
          const users = await this.userModel
            .find({ email: { $in: userEmails } })
            .select('name lastname email')
            .lean() // Retornar objetos planos
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
            ...trip,
            acceptedRequests: passengers
          } as any;
          
          return tripWithPassengers;
        }
      } catch (error) {
        console.error('Error processing acceptedRequests:', error);
        // Si hay error, mantener los IDs originales
      }
    }

    return trip as Trip;
  }

  async findNonDriverTrips(email: string): Promise<Trip[]> {
    const trips = await this.tripModel
      .find({ driver: { $ne: email } })
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .lean() // Retornar objetos planos
      .exec();
    return trips as Trip[];
  }

  async findByPassenger(passengerEmail: string): Promise<Trip[]> {
    // Buscar requests aceptadas del pasajero
    const acceptedRequests = await this.requestModel
      .find({ email: passengerEmail, status: 'ACCEPTED' })
      .select('tripId')
      .lean() // Retornar objetos planos
      .exec();
    
    if (!acceptedRequests.length) {
      return [];
    }

    const tripIds = acceptedRequests.map(request => request.tripId);

    const trips = await this.tripModel
      .find({ id: { $in: tripIds } })
      .select('-__v -_id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .populate('acceptedRequests')
      .sort({ createdTimestamp: 'desc' })
      .lean() // Retornar objetos planos
      .exec();
      
    return trips as Trip[];
  }

  async create(trip: NewTripDTO): Promise<Trip> {
    const createdTrip = await this.tripModel.create(trip as any);
    if (!createdTrip) {
      throw new Error('Failed to create trip');
    }
    const tripDoc = Array.isArray(createdTrip) ? createdTrip[0] : createdTrip;
    return tripDoc.toObject() as Trip;
  }

  async findByIdAndDriver(driver: string, id: string): Promise<Trip> {
    const filter = {
      driver,
      id,
    };

    const trip = await this.tripModel
      .findOne(filter)
      .lean() // Retornar objeto plano
      .exec();

    return trip as Trip;
  }

  async passengersByTrip(id: string): Promise<any[]> {
    try {
      const acceptedRequests = await this.requestModel
        .find({ tripId: id, status: 'ACCEPTED' })
        .lean() // Retornar objetos planos
        .exec();

      if (!acceptedRequests.length) {
        return [];
      }

      const passengerEmails = acceptedRequests.map(request => request.email);
      const passengers = await this.userModel
        .find({ email: { $in: passengerEmails } })
        .select('name lastname email')
        .lean() // Retornar objetos planos
        .exec();

      return passengers;
    } catch (error) {
      throw new Error('Error finding passengers: ' + error.message);
    }
  }
}
