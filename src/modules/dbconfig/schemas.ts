import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Trip , Location, Package, Solicitud} from '../configs/entities/entities';

export type RegisterDocument = Register & Document;

//TODO: Collection de Users
//TODO: El schema le brinda propiedades a la clase Users para interactuar con la base de datos
@Schema()
export class Register {

  @Prop({required: true}) // para propiedades requeridas
  username: string;

  @Prop({required: true}) // para propiedades requeridas
  name: string;

  @Prop({required: true}) // para propiedades requeridas
  lastname: string;

  @Prop({unique:true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  verificationCode: number;

  @Prop({required: true})
  statusVerification: string;

}

export const RegisterSchema = SchemaFactory.createForClass(Register);


export type UserDocument = User & Document;

//TODO: Collection de Users
//TODO: El schema le brinda propiedades a la clase Users para interactuar con la base de datos
@Schema()
export class User {

  @Prop({required: true}) // para propiedades requeridas
  username: string;

  @Prop({required: true}) // para propiedades requeridas
  name: string;

  @Prop({unique:true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: false})
  trips: Trip[];

  @Prop({required: false})
  locations: Location[];

  @Prop({required: false})
  packages: Package[]

  @Prop({required: false})
  tripsFavourites:Trip[]

  @Prop({required: false})
  subscribedTrips:Trip[]

  @Prop({required: false})
  tripsCreated:Trip[]

  @Prop({required: false})
  solicitudes: Solicitud []

}

export const UserSchema = SchemaFactory.createForClass(User);