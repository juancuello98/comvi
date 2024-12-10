import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from '../fuels/schemas/ProductSchemas';
import { ProductIdNumber } from '../fuels/enums/fuel-type.enum';

export type VehicleDocument = Vehicle & Document;

@Schema({ _id: false }) // Esto desactiva la generación automática de _id
export class Vehicle {

  @Prop({ type: String, unique: true, required: true, index: true })
  patentPlate: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  pics: string[];

  @Prop({ required: true, type:String, ref:"User", match: [/.+\@.+\..+/, 'Please enter a valid email address'] })
  user: string;

  @Prop()
  color: string;

  @Prop({ required: true, min: 0 })
  consumption: number;

  @Prop({ required: true, type: [String], ref: 'Product' })
  fuels: Product[] | string[];
  
  getFuelsString(): ProductIdNumber[] {
    let s: ProductIdNumber[] = [];
      this.fuels.map((f: unknown) => {
        if (typeof f === 'object') {
          let id =(f as Product).idproducto as ProductIdNumber 
          s.push(id);
        } else {
          let id = f as ProductIdNumber;
          s.push(id);
        }
      });
      return s;
    }
  

}




export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.methods.getFuelsString = function (): ProductIdNumber[] {
  let s: ProductIdNumber[] = [];
  this.fuels.map((f: unknown) => {
    if (typeof f === 'object') {
      let id = (f as Product).idproducto as ProductIdNumber;
      s.push(id);
    } else {
      let id = f as ProductIdNumber;
      s.push(id);
    }
  });
  return s;
};

