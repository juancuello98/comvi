import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location } from '../locations/location.schema';
import { Package } from '../packages/package.schema';
import { Request } from '../requests/request.schema';
import { Trip } from '../trips/trip.schema';

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

  @Prop({required: true})
  validated: string;

  @Prop({required: true})
  verificationCode: number;

  @Prop()
  trips: Trip[];

  @Prop()
  locations: Location[];

  @Prop()
  packages: Package[]

  @Prop()
  tripsFavourites:Trip[]

  @Prop()
  subscribedTrips:Trip[]

  @Prop()
  tripsCreated:Trip[]

  @Prop()
  joinRequests: Request []

}

export const UserSchema = SchemaFactory.createForClass(User);