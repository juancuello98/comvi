import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TripResumeDocument = TripResume & Document;
/**
 * Esquema para representar un resumen de viaje en la base de datos.
 */
@Schema()
export class TripResume {
  /**
   * @property {string} id - Lista de IDs de los pasajeros del viaje.
   */
  @Prop({ required:true, type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  passengers: string[];

  /**
   * @property {string} id - Lista de IDs de las valuaciones asociadas al viaje.
   */
  @Prop({ required:true, type: MongooseSchema.Types.ObjectId, ref: 'Valuations' })
  valuations: string[];

  /**
   * @property {string} id - Marca de tiempo de inicio del viaje.
   */
  @Prop({ required: true })
  startedTimestamp: string;

  /**
   * @property {string} id - Marca de tiempo de finalización del viaje.
   */
  @Prop()
  endedTimestamp: string;
}

export const TripResumeSchema = SchemaFactory.createForClass(TripResume);
