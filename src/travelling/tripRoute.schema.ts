import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { FuelsStation } from 'src/models/fuels/schemas/FuelsStationSchemas';
import { DirectionsResponse } from './interface/directions-response.interface'; // Ajusta la ruta según sea necesario


export type TripRouteDocument = TripRoute & Document;

@Schema({ timestamps: true })
/**
 * Representa un viaje en la base de datos.
*
 * @class
 */
export class TripRoute {
  /**
   * @property {string} id - UUID de viaje.
   */
  @Prop({ type: String, ref: '_id' })
  id: string;

  /**
   * @property {DirectionsResponse} route - Ruta del viaje.
   */
  @Prop({ type: Object })
  route: DirectionsResponse;

  /**
   * @property {boolean} allowPackage - Indica si se permiten paquetes en el viaje.
   */
  @Prop({ required: true, default: false, ref: 'FuelsStation', type: [MongooseSchema.Types.ObjectId] })
  fuelStation: string[]|FuelsStation[];

  /**
   * @property {number} kilometers - Distancia total del viaje en kilómetros.
   */
  @Prop({ default: 0 })
  distance: number;


}

export const TripRouteSchema = SchemaFactory.createForClass(TripRoute);

