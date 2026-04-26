import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Trip } from '@/trips/trip.schema';
import { User } from '@/users/user.schema';

export type ValuationDocument = Valuation & Document;

@Schema({ timestamps: true })
export class Valuation {

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId })
  id: string;

  @Prop({ required: true, type: String, ref: 'Trips' })
  trip: string | Trip;

  /** Email del usuario que emite la valoración */
  @Prop({ required: true, type: String, ref: 'User' })
  user: string | User;

  /** Email del usuario que recibe la valoración */
  @Prop({ required: true, type: String })
  valoradoEmail: string;

  /** Puntaje de la valoración (1-5 estrellas) */
  @Prop({ required: true, type: Number, min: 1, max: 5 })
  puntaje: number;

  /** Comentario opcional de la valoración */
  @Prop({ required: false, type: String })
  detalle: string;

  /** Etiquetas opcionales de la valoración */
  @Prop({ required: false, type: [String], default: [] })
  tags: string[];

  /** Indica si el pasajero abonó el viaje */
  @Prop({ required: false, type: Boolean, default: false })
  paid: boolean;

  getMail(): string {
    if (typeof this.user === 'string') {
      return this.user;
    }
    return this.user.email;
  }

  getTripId(): string {
    if (typeof this.trip === 'string') {
      return this.trip;
    }
    return this.trip.id;
  }
}

export const ValuationSchema = SchemaFactory.createForClass(Valuation);
