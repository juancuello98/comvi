import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PasswordToken } from './passwordToken.schema';

export type UserDocument = User & Document;
/**
 * Representa un usuario en la base de datos.
 */
@Schema()
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
  @Prop({ unique: true })
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
  @Prop()
  resetPasswordToken: PasswordToken;

  /**
   * Rating promedio del usuario (1-5 estrellas).
   */
  @Prop({ type: Number, default: 0 })
  averageRating: number;

  /**
   * Cantidad total de valoraciones recibidas.
   */
  @Prop({ type: Number, default: 0 })
  totalReviews: number;
}

/**
 * Esquema de Mongoose para el usuario.
 */
export const UserSchema = SchemaFactory.createForClass(User);
