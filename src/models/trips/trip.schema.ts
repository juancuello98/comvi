import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TripStatus } from './enums/state.enum';

export type TripDocument = Trip & Document;

@Schema()
/**
 * Representa un viaje en la base de datos.
 *
 * @class
 */
export class Trip {
  /**
   * @property {Location} origin - Ubicación de origen del viaje.
   */
  @Prop({ required: true })
  origin: unknown;

  /**
   * @property {Location} destination - Ubicación de destino del viaje.
   */
  @Prop({ required: true })
  destination: unknown;

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
  @Prop({ required: true })
  vehicleId: string;

  /**
   * @property {string} driver - ID del conductor del viaje.
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
  @Prop({ required: true })
  status: TripStatus;

  /**
   * @property {string[]} passengers - IDs de los usuarios que participan como pasajeros en el viaje.
   */
  @Prop()
  passengers: string[];

  /**
   * @property {string[]} paquetes - IDs de los paquetes que van en el viaje.
   */
  @Prop()
  paquetes: string[];

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
  @Prop()
  tripsRequests: string[];

  /**
   * @property {string[]} valuations - IDs de las valuaciones asociadas al viaje.
   */
  @Prop()
  valuations: string[];

  /**
   * @property {string} tripResumeId - ID del resumen del viaje.
   */
  @Prop()
  tripResumeId: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
