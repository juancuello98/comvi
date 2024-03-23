import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehiclesDocument = Vehicles & Document;

@Schema()
export class Vehicles {
  @Prop({ required: true })
  patentPlate: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  pics: string[];

  @Prop({ required: true })
  email: string;

  @Prop()
  color: string;
}

export const VehiclesSchema = SchemaFactory.createForClass(Vehicles);
