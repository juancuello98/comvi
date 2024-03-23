import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Request } from '../requests/request.schema';
import { Trip } from '../trips/trip.schema';
import { PasswordToken } from './passwordToken.schema';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true }) // para propiedades requeridas
  lastname: string;

  @Prop({ required: true }) // para propiedades requeridas
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  validated: string;

  @Prop({ required: true })
  verificationCode: string;

  @Prop()
  trips: Trip[];

  @Prop()
  locations: Location[];

  @Prop()
  packages: string[];

  @Prop()
  tripsFavourites: Trip[];

  @Prop()
  subscribedTrips: Trip[];

  @Prop()
  tripsCreated: Trip[];

  @Prop()
  joinRequests: Request[];

  @Prop()
  resetPasswordToken: PasswordToken;
}

export const UserSchema = SchemaFactory.createForClass(User);
