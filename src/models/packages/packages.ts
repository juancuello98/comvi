import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackagesDocument = Packages & Document;

/**
 * Representa un paquete en la base de datos.
 */
@Schema()
export class Packages {

  /**
   * Tamaño del paquete.
   */
  @Prop({ type: String, enum: ['small', 'medium', 'large', 'extra_large'], required: true })
  size: string;

  /**
   * Peso del paquete.
   */
  @Prop({ required: true ,  type: String})
  weight: number;

/**
 * DNI del propietario del paquete.
 */
  @Prop({ required: true, type: String, ref: 'Person' })
  owner: string;

  /**
 * link de fotos que van al Blob.
 */
  @Prop({ required: true })
  pictures: string[];

}

/**
 * Esquema de Mongoose para el paquete.
 */
export const PackagesSchema = SchemaFactory.createForClass(Packages);