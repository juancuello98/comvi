import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Puntaje } from './puntaje.enums';
import { Trip, TripDocument } from '@/trips/trip.schema';
import { User, UserDocument } from '@/users/user.schema';

export type ValuationDocument = Valuation & Document;

@Schema({ timestamps: true })// Marca una clase como definición de esquema y añade timestamps
// @Prop : Define una propiedad en el documento
export class Valuation {

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId })
  id: string;
  
  @Prop({ required:true, type: String, ref: 'Trips' })
  trip: string|Trip;

  @Prop({ required:true, type: String, ref: 'User' })
  user: string|User;

  @Prop()
  detalle: string;

  @Prop({ required: true, type: Number})
  puntaje: Puntaje;

  getMail(): string  {
    if (typeof this.user === 'string') {
        return this.user;
    } else {
        return (this.user.email)
    }
  
  }

  getTripId(): string {
    if (typeof this.trip === 'string') {
        return this.trip;
    } else {
        return (this.trip.id)
    }
  }



}

export const ValuationSchema = SchemaFactory.createForClass(Valuation); // Asigna nuestra Catclase a una colección MongoDB del mismo nombre, pero con una “s” adicional al final, por lo que el nombre final de la colección mongo será cats
