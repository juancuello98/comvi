import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from './enums/state.enum';

export type TripDocument = Trip & Document;
//TODO: Ver si es necesario un public_id para cuando queres ver un viaje y compartir esa url con ese viaje 
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
  @Prop({ required: true })
  id: string;

  /**
   * @property {Location} origin - Ubicación de origen del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  origin: MongooseSchema.Types.ObjectId;

  /**
   * @property {Location} destination - Ubicación de destino del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  destination: MongooseSchema.Types.ObjectId;

  /**
   * @property {string} description - Descripción del viaje.
   */
  @Prop({ required: true })
  description: string;

  /**
   * @property {boolean} allowPackage - Indica si se permiten paquetes en el viaje.
   */
  @Prop({ required: true })
  allowPackage: boolean;

  /**
   * @property {boolean} allowPassenger - Indica si se permiten pasajeros en el viaje.
   */
  @Prop({ required: true })
  allowPassenger: boolean;

  /**
   * @property {number} peopleQuantity - Cantidad de personas como pasajeros para el viaje.
   */
  @Prop({ required: true })
  peopleQuantity: number;

  /**
   * @property {number} placesAvailable - Cantidad de lugares disponibles en el viaje.
   */
  @Prop()
  placesAvailable: number;

  /**
   * @property {Vehicle} vehicle - Id del vehículo utilizado en el viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Vehicle' })
  vehicle: MongooseSchema.Types.ObjectId;

  /**
   * @property {string} driver - Email del conductor del viaje.
   */
  @Prop({ required: true })
  driver: string;

  /**
   * @property {string} startedTimestamp - Marca de tiempo de inicio del viaje.
   */
  @Prop({ required: true })
  startedTimestamp: string;

  /**
   * @property {TripStatus} status - Estado actual del viaje.
   */
  @Prop({ required: true, type: String })
  status: TripStatus;

  /**
   * @property {string[]} passengers - IDs de los usuarios que participan como pasajeros en el viaje.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  passengers: MongooseSchema.Types.ObjectId[];

  /**
   * @property {string[]} packages - IDs de los packages que van en el viaje.
   */
  @Prop()
  packages: string[];

  /**
   * @property {number} estimatedCosts - Costos estimados del viaje.
   */
  @Prop()
  estimatedCosts: number;

  /**
   * @property {number} kilometers - Distancia total del viaje en kilómetros.
   */
  @Prop()
  kilometers: number;

  /**
   * @property {string} createdTimestamp - Marca de tiempo de creación del viaje.
   */
  @Prop()
  createdTimestamp: string;

  /**
   * @property {string[]} tripsRequests - IDs de las solicitudes asociadas al viaje.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Requests' })
  tripsRequests: MongooseSchema.Types.ObjectId[];

  /**
   * @property {string[]} valuations - IDs de las valuaciones asociadas al viaje.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Valuations' })
  valuations: MongooseSchema.Types.ObjectId[];

  /**
   * @property {string} tripResumeId - ID del resumen del viaje.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TripResumes' })
  tripResumeId: MongooseSchema.Types.ObjectId;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
