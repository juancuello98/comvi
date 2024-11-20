import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PasswordToken } from './passwordToken.schema';

export type UserDocument = User & Document;

/**
 * Representa un usuario en la base de datos.
 */
@Schema({ _id: false })
export class User {

  /**
   * Apellido del usuario.
   */
  @Prop({ required: true })
  lastname: string;

  /**
   * Nombre del usuario.
   */
  @Prop({ required: true })
  name: string;
  /**
   * Correo electrónico único del usuario.
   */
  @Prop({ type: String, unique: true, required: true, index: true })
  email: string;

  /**
   * Contraseña del usuario.
   */
  @Prop({ required: true })
  password: string;

  /**
   * Indica si el usuario ha sido validado.
   */
  @Prop({ required: true })
  status: string;

  /**
   * Código de verificación del usuario.
   */
  @Prop({ required: true })
  verificationCode: string;

  /**
   * Token para restablecer la contraseña del usuario.
   */
  @Prop({ type: PasswordToken })
  resetPasswordToken: PasswordToken;
}

/**
 * Esquema de Mongoose para el usuario.
 */
export const UserSchema = SchemaFactory.createForClass(User);
