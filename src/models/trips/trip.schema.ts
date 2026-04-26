import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from './enums/state.enum';
import { Vehicle } from '@/vehicles/vehicles.schema';
import { User } from '@/users/user.schema';
import { Location } from '@/locations/location-schema';
// import { Request } from '@/requests/request.schema';
import { Valuation } from '@/valuations/entities/valuation.schema';
import { TripResume } from './resumes/trip.resume.schema';
import { Price_x_Packages } from '../packages/price_packages';
// import { Booking } from '@/bookings/booking.schema'; // Juancito despues agrega esto

// import { Booking } from '@/bookings/booking.schema'; // Juancito despues agrega esto
export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
/**
 * Representa un viaje en la base de datos.
 *
 * @class
 */
export class Trip {
  id: string; // Mongoose virtual getter - returns _id.toHexString()

  /**
   * @property {Location} origin - Ubicación de origen del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location', default: null })
  origin: Location;

  /**
   * @property {Location} destination - Ubicación de destino del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location', default: null })
  destination: Location;

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
  @Prop({ required: true, type: String, ref: 'Vehicle', default: null })
  // vehicle: MongooseSchema.Types.ObjectId;
  vehicle: string| Vehicle;

  /**
   * @property {User} User - Email del conductor del viaje.
   */
  @Prop({ required: true, type: String, ref: 'User', default: null })
  // driver: MongooseSchema.Types.ObjectId;
  driver:  string | User;

  /**
   * @property {TripStatus} status - Estado actual del viaje.
   */
  @Prop({ required: true, type: String, default: TripStatus.OPEN })
  status: TripStatus;

  /**
   * @property {string} startedTimestamp - Fecha y hora planificada de salida del viaje.
   */
  @Prop({ required: false, default: null })
  startedTimestamp: string;

  /**
   * @property {Booking[]} passengers - IDs de los usuarios que participan como pasajeros en el viaje.
   */
  @Prop({ required: true, type:  [MongooseSchema.Types.ObjectId], default: [] })

  // bookings: MongooseSchema.Types.ObjectId[];
  // bookings: string[] | Booking[];
  bookings: string[];

  /**
   * @property {string[]} acceptedPassengers - Emails de los pasajeros con solicitud aceptada.
   */
  @Prop({ type: [String], default: [] })
  acceptedPassengers: string[];

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

  @Prop({ default: 0 })
  priceForPassenger: number;

  @Prop({ default: 0 })
  priceForPackages: Price_x_Packages[];

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


  getVehicle(): Vehicle {
    if (typeof this.vehicle =="object") {
      return this.vehicle;
    }
    return null;
  }
  getPantent(): string {
    if (typeof this.vehicle =="string") {
      return this.vehicle;
    }
    return null;
  }
  getDriver(): User {
    if (typeof this.driver =="object") {
      return this.driver;
    }
    return null;
  }

}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.set('timestamps', true);

TripSchema.methods.getVehicle = function() {
  if (typeof this.vehicle == "object") {
    return this.vehicle;
  }
  return null;
};

TripSchema.methods.getPantent = function() {
  if (typeof this.vehicle == "string") {
    return this.vehicle;
  }
  return null;
};

TripSchema.methods.getDriver = function() {
  if (typeof this.driver == "object") {
    return this.driver;
  }
  return null;
};
