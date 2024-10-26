import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from './enums/state.enum';
import { Vehicle } from '@/vehicles/vehicles.schema';
import { User } from '@/users/user.schema';
import { Location } from '@/locations/location-schema';
import { Request } from '@/requests/request.schema';
import { Valuation } from '@/valuations/entities/valuation.schema';
import { TripResume } from './resumes/trip.resume.schema';

// import { Booking } from '@/bookings/booking.schema'; // Juancito despues agrega esto
export type TripDocument = Trip & Document;

@Schema()
/**
 * Representa un viaje en la base de datos.
 *
 * @class
 */
export class Trip {
  /**
   * @property {string} id - UUID de viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.UUID, default: null })
  id: string;

  /**
   * @property {Location} origin - Ubicación de origen del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location', default: null })
  // origin:  Location | string | MongooseSchema.Types.ObjectId;
  origin:  Location | string ;

  /**
   * @property {Location} destination - Ubicación de destino del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location', default: null })
  destination: Location | string;

  /**
   * @property {string} description - Descripción del viaje.
   */
  @Prop({ required: true, default: '' })
  description: string;

  /**
   * @property {boolean} allowPackage - Indica si se permiten paquetes en el viaje.
   */
  @Prop({ required: true, default: false })
  allowPackage: boolean;

  /**
   * @property {boolean} allowPassenger - Indica si se permiten pasajeros en el viaje.
   */
  @Prop({ required: true, default: false })
  allowPassenger: boolean;

  /**
   * @property {number} peopleQuantity - Cantidad de personas como pasajeros para el viaje.
   */
  @Prop({ required: true, default: 0 })
  peopleQuantity: number;

  /**
   * @property {number} placesAvailable - Cantidad de lugares disponibles en el viaje.
   */
  @Prop({ default: 0 })
  placesAvailable: number;

  /**
   * @property {Vehicle} vehicle - Id del vehículo utilizado en el viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', default: null })
  // vehicle: MongooseSchema.Types.ObjectId;
  vehicle: Vehicle | string;

  /**
   * @property {User} User - Email del conductor del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  // driver: MongooseSchema.Types.ObjectId;
  driver: User | string;

  /**
   * @property {string} startedTimestamp - Marca de tiempo de inicio del viaje.
   */
  @Prop({ required: true, default: () => new Date().toISOString() })
  startedTimestamp: string;

  /**
   * @property {TripStatus} status - Estado actual del viaje.
   */
  @Prop({ required: true, type: String, default: TripStatus.OPEN })
  status: TripStatus;

  /**
   * @property {Booking[]} passengers - IDs de los usuarios que participan como pasajeros en el viaje.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Booking', default: [] })
  // bookings: MongooseSchema.Types.ObjectId[];
  // bookings: string[] | Booking[];
  bookings: string[];

  /**
   * @property {string[]} packages - IDs de los packages que van en el viaje.
   */
  @Prop({ default: [] })
  packages: string[];

  /**
   * @property {number} estimatedCosts - Costos estimados del viaje.
   */
  @Prop({ default: 0 })
  estimatedCosts: number;

  /**
   * @property {number} kilometers - Distancia total del viaje en kilómetros.
   */
  @Prop({ default: 0 })
  kilometers: number;


  /**
   * @property {Request[]} tripsRequests - IDs de las solicitudes asociadas al viaje.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Request', default: [] })
  // tripsRequests: MongooseSchema.Types.ObjectId[];
  tripsRequests: Request [] | string[];

  /**
   * @property {Valuation[]} valuations - IDs de las valuaciones asociadas al viaje.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Valuation', default: [] })
  // valuations: MongooseSchema.Types.ObjectId[];
  valuations: string[] | Valuation[];


  /**
   * @property {TripResume} tripResumeId - ID del resumen del viaje.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TripResume', default: null })
  // tripResumeId: MongooseSchema.Types.ObjectId;
  tripResumeId: string | TripResume;

}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.set('timestamps', true);
