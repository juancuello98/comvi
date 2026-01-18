import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ValuationDocument = Valuation & Document;

@Schema()
/**
 * Representa una valoración/reseña de un usuario después de un viaje.
 */
export class Valuation {
  /**
   * Email del usuario que crea la valoración (quien valora).
   */
  @Prop({ required: true })
  email: string;

  /**
   * Email del usuario que está siendo valorado.
   */
  @Prop({ required: true })
  valoradoEmail: string;

  /**
   * ID del viaje asociado a la valoración.
   */
  @Prop({ required: true })
  tripId: string;

  /**
   * Puntaje de la valoración (1-5 estrellas).
   */
  @Prop({ required: true, type: Number, min: 1, max: 5 })
  puntaje: number;

  /**
   * Comentario/descripción opcional de la valoración.
   */
  @Prop()
  detalle: string;

  /**
   * Tags seleccionados para la valoración.
   */
  @Prop({ type: [String], default: [] })
  tags: string[];

  /**
   * Indica si el usuario valorado pagó lo acordado.
   */
  @Prop({ required: true, default: false })
  paid: boolean;

  /**
   * Marca de tiempo de creación de la valoración.
   */
  @Prop({ required: true })
  fechaHoraCreado: string;
}

export const ValuationSchema = SchemaFactory.createForClass(Valuation); // Asigna nuestra Catclase a una colección MongoDB del mismo nombre, pero con una “s” adicional al final, por lo que el nombre final de la colección mongo será cats
