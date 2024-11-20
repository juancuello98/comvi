import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ required: true })
  geojson: string;

  @Prop({ type: [String], ref: 'Product.idproducto', required: true })
  productos: string[];
}

export const FuelsStationSchema = SchemaFactory.createForClass(FuelsStation);