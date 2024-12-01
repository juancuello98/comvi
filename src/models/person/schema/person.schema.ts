import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PersonDocument = Person & Document;

/**
 * Representa una persona en la base de datos.
 */
@Schema()
export class Person {

  /**
   * DNI de la persona.
   */
  @Prop({ required: true, unique: true })
  dni: number;

  /**
   * Nombre de la persona.
   */
  @Prop({ required: true })
  name: string;

  /**
   * Fecha de nacimiento de la persona.
   */
  @Prop({ required: true })
  birthday: Date;

  /**
   * Apellido de la persona.
   */
  @Prop({ required: true })
  lastname: string;

  /**
   * Foto de la persona.
   */
  @Prop({ required: false })
  picture: string;

  

  @Prop({ required: true , type: Boolean, default: false })
  validated: boolean;
}

/**
 * Esquema de Mongoose para la persona.
 */
export const PersonSchema = SchemaFactory.createForClass(Person);