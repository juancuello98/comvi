import { User } from '@/users/user.schema';
import { Valuation } from '@/valuations/entities/valuation.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TripResumeDocument = TripResume & Document;
/**
 * Esquema para representar un resumen de viaje en la base de datos.
 */
@Schema({ timestamps: true })
export class TripResume {
  /**
   * @property {User[]} passengers - Lista de IDs de los pasajeros del viaje.
   */
  @Prop({ required: true, type: [{ type: [MongooseSchema.Types.ObjectId], ref: 'User' }] })
  passengers: string[] | User[];

  /**
   * @property {Valuation[]} valuations - Lista de IDs de las valuaciones asociadas al viaje.
   */
  @Prop({ required: true, type: [{ type: [MongooseSchema.Types.ObjectId], ref: 'Valuation' }] })
  valuations: string[] | Valuation[];

  /**
   * @property {string} id - id del Trip.
   */
  @Prop({ required:true, type: MongooseSchema.Types.ObjectId, ref: 'Trip' })
  tripId: string;
  
}

export const TripResumeSchema = SchemaFactory.createForClass(TripResume);
TripResumeSchema.set('timestamps', true);

