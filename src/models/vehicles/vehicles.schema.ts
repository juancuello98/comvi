import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
  @Prop({ required: true, unique: true })
  patentPlate: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  pics: string[];

  @Prop({ required: true })
  email: string;

  @Prop()
  color: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
