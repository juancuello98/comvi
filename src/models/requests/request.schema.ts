import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Trip, TripDocument } from '../trips';
import { UserDocument } from '@/users/user.schema';

export type RequestDocument = Request & Document;

@Schema()
export class Request {
  
  @Prop({ required: true , type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: UserDocument|MongooseSchema.Types.ObjectId;
  
  @Prop({ required: true})
  email: string;

  @Prop({ required: true, type: MongooseSchema.Types.UUID, ref: 'Trips' })
  tripId: TripDocument|string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  hasEquipment: boolean;

  @Prop({ required: true })
  hasPartner: boolean;

  @Prop({ required: false })
  partnerQuantity: number;

  @Prop({ required: true })
  totalPassenger: number;

  @Prop({ required: true })
  createdTimestamp: string;

  @Prop({ required: true })
  status: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
