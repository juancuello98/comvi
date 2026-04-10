import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from './ProductSchemas';
import { ProductIdNumber } from '../enums/fuel-type.enum';

export type FuelsStationDocument = FuelsStation & Document;

@Schema({ timestamps: true })
export class  FuelsStation {
  @Prop({ type: String, required: true, unique: true })
  stationId: string;

  @Prop({ required: true })
  cuit: string;

  @Prop({ required: true })
  empresa: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  localidad: string;

  @Prop({ required: true })
  provincia: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  idempresabandera: string;

  @Prop({ required: true })
  empresabandera: string;

  @Prop({ required: true })
  latitud: number;

  @Prop({ required: true })
  longitud: number;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })
  geojson: { type: string; coordinates: number[] };
  
  @Prop({ type: [String], ref: 'Product', required: true })
  productos: string[];

  @Prop({ type: Object }) // Precios por producto
  precios: {
    [productoId: number]: {
      promedio: number;
      dia: number;
      noche: number;
    };
  };
}

export const FuelsStationSchema = SchemaFactory.createForClass(FuelsStation);