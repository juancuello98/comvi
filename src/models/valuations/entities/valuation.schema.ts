import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Puntaje } from './puntaje.enums';
import { TripDocument } from '@/trips/trip.schema';
import { UserDocument } from '@/users/user.schema';

export type ValuationDocument = Valuation & Document;

@Schema({ timestamps: true })// Marca una clase como definición de esquema y añade timestamps
// @Prop : Define una propiedad en el documento
export class Valuation {

  @Prop({ required: false })
  id: string;
  
  @Prop({ required: true })
  email: string;

  @Prop({ required:true, type: MongooseSchema.Types.ObjectId, ref: 'Trips' })
  tripId: string|TripDocument;

  @Prop({ required:true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string|UserDocument;

  @Prop()
  detalle: string;

  @Prop({ required: true, type: Number})
  puntaje: Puntaje;
}

export const ValuationSchema = SchemaFactory.createForClass(Valuation); // Asigna nuestra Catclase a una colección MongoDB del mismo nombre, pero con una “s” adicional al final, por lo que el nombre final de la colección mongo será cats
