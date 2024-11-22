import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, unique: true })
  idproducto: string;

  @Prop({ required: true })
  producto: string;

 
}

export const ProductSchema = SchemaFactory.createForClass(Product);