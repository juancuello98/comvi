import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Request } from '../requests/request.schema';
import { Trip } from '../trips/trip.schema';
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
  validated: string;

  /**
   * Código de verificación del usuario.
   */
  @Prop({ required: true })
  verificationCode: string;

  /**
   * Viajes asociados al usuario.
   */
  @Prop()
  trips: Trip[];

  /**
   * Localizaciones asociadas al usuario.
   */
  @Prop()
  locations: Location[];

  /**
   * Paquetes asociados al usuario.
   */
  @Prop()
  packages: string[];

  /**
   * Viajes favoritos del usuario.
   */
  @Prop()
  tripsFavourites: Trip[];

  /**
   * Viajes en los que el usuario está suscrito.
   */
  @Prop()
  subscribedTrips: Trip[];

  /**
   * Viajes creados por el usuario.
   */
  @Prop()
  tripsCreated: Trip[];

  /**
   * Solicitudes de unión asociadas al usuario.
   */
  @Prop()
  joinRequests: Request[];

  /**
   * Token para restablecer la contraseña del usuario.
   */
  @Prop()
  resetPasswordToken: PasswordToken;
}

/**
 * Esquema de Mongoose para el usuario.
 */
export const UserSchema = SchemaFactory.createForClass(User);
