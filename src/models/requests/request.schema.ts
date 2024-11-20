import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Trip, TripDocument } from '../trips';
import { User, UserDocument } from '@/users/user.schema';

export type RequestDocument = Request & Document;

@Schema()
export class Request {

  @Prop({ type: MongooseSchema.Types.ObjectId })
  id: string;
  
  @Prop({ required: true , type: String, ref: 'User' })
  sender: User|string;
  

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Trips' })
  trip: Trip|string;

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

  getMail(): string  {
    if (typeof this.sender === 'string') {
        return this.sender;
    } else {
        return (this.sender.email)
    }
  
  }

  getTripId(): string {
    if (typeof this.trip === 'string') {
        return this.trip;
    } else {
        return (this.trip.id)
    }
  }
}


export const RequestSchema = SchemaFactory.createForClass(Request);
