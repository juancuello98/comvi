import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PasswordTokenModule } from './passwordToken.module';
export type PasswordTokenDocument = PasswordToken & Document;

//TODO: Collection de PasswordToken
//TODO: El schema le brinda propiedades a la clase PasswordToken para interactuar con la base de datos
@Schema()
export class PasswordToken {

  @Prop({required: true}) // para propiedades requeridas
  code: string;

  @Prop({required: true}) // para propiedades requeridas
  created: Date;

  @Prop({required:true})
  expire: Date;


}

export const PasswordTokenSchema = SchemaFactory.createForClass(PasswordToken);
