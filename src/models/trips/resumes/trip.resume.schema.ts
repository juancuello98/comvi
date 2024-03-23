import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripResumeDocument = TripResume & Document;
/**
 * Esquema para representar un resumen de viaje en la base de datos.
 */
@Schema()
export class TripResume {
  /**
   * Lista de IDs de los pasajeros del viaje.
   */
  @Prop({ required: true })
  passengers: string[];

  /**
   * Lista de IDs de las valuaciones asociadas al viaje.
   */
  @Prop()
  valuations: string[];

  /**
   * Marca de tiempo de inicio del viaje.
   */
  @Prop({ required: true })
  startedTimestamp: string;

  /**
   * Marca de tiempo de finalización del viaje.
   */
  @Prop()
  endedTimestamp: string;
}

export const TripResumeSchema = SchemaFactory.createForClass(TripResume);
