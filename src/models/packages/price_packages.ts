import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Price_x_PackagesDocument = Price_x_Packages & Document;

/**
 * Representa un paquete en la base de datos.
 */
@Schema()
export class Price_x_Packages {

  /**
   * Tamaño del paquete.
   */
  @Prop({ type: String, enum: ['small', 'medium', 'large', 'extra_large'], required: true })
  size: string;

  /**
   * Precio del paquete.
   */

  @Prop({ required: true ,  type: Number})
  price: number;
}

/**
 * Esquema de Mongoose para el paquete.
 */
export const Price_x_PackagesSchema = SchemaFactory.createForClass(Price_x_Packages);