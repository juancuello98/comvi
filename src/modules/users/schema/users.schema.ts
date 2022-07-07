import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = User & Document;

//TODO: Collection de Users
//TODO: El schema le brinda propiedades a la clase Users para interactuar con la base de datos
@Schema()
export class User {
  @Prop({required: true}) // para propiedades requeridas
  name: string;

  @Prop({unique:true})
  email: string;

  @Prop({required: true})
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);