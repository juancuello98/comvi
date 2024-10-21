import { User } from '@/users/user.schema';
import { Valuation } from '@/valuations/entities/valuation.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TripResumeDocument = TripResume & Document;
/**
 * Esquema para representar un resumen de viaje en la base de datos.
 */
@Schema()
export class TripResume {
  /**
   * @property {User[]} passengers - Lista de IDs de los pasajeros del viaje.
   */
  @Prop({ required: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  passengers: MongooseSchema.Types.ObjectId[] | User[];

  /**
   * @property {Valuation[]} valuations - Lista de IDs de las valuaciones asociadas al viaje.
   */
  @Prop({ required: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Valuation' }] })
  valuations: MongooseSchema.Types.ObjectId[] | Valuation[];

  /**
   * @property {string} startedTimestamp - Marca de tiempo de inicio del viaje.
   */
  @Prop({ required: true })
  startedTimestamp: string;

  /**
   * @property {string} endedTimestamp - Marca de tiempo de finalización del viaje.
   */
  @Prop()
  endedTimestamp: string;
}

export const TripResumeSchema = SchemaFactory.createForClass(TripResume);
TripResumeSchema.set('timestamps', true);

