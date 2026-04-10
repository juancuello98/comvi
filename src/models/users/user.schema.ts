import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types,  Model, Schema as MongooseSchema, model } from 'mongoose';
import { PasswordToken } from './passwordToken.schema';
import { Person, PersonDocument } from '../person/schema/person.schema';


export type UserDocument = User & Document;

/**
 * Representa un usuario en la base de datos.
 */
@Schema({ _id: false })
export class User extends Person {

  /**
   * Correo electrónico único del usuario.
   */
  @Prop({ type: String, unique: true, required: true, index: true })
  email: string;

  /**
   * Avatar de la persona.
   */
  @Prop({ required: true })
  avatar: string;

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

  @Prop({ type: String, enum: ['admin', 'user'], default: 'user' })	
  role: string;

  @Prop({ type: [String], default: [] })
  tokkens: string[]


}

/**
 * Esquema de Mongoose para el usuario.
 */
export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre<UserDocument>('save', async function (next) {
//   const personModel = model(Person.name) as Model<PersonDocument>;
//   const personExists = await personModel.exists({ dni: this.dni });
//   if (!personExists) {
//     await personModel.create({ dni: this.dni, name: this.name, birthday: this.birthday , lastname: this.lastname, picture: this.picture });
//   }
//   next();
// }); a corregir