import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestDocument = Request & Document;

@Schema()
export class Request {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  tripId: string;

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
