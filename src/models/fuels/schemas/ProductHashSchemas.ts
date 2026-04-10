import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductHashDocument = ProductHash & Document;

@Schema({ timestamps: true })
export class ProductHash {
  @Prop({
    type: [
      {
        promedio: { type: Number, required: true },
        id: { type: String, required: true },
        nombre: { type: String, required: true },
      },
    ],
    required: true,
  })
  diurno: Array<{
    promedio: number;
    id: string;
    nombre: string;
  }>;

  @Prop({
    type: [
      {
        promedio: { type: Number, required: true },
        id: { type: String, required: true },
        nombre: { type: String, required: true },
      },
    ],
    required: true,
  })
  nocturno: Array<{
    promedio: number;
    id: string;
    nombre: string;
  }>;

  @Prop({
    type: [
      {
        idtipohorario: { type: String, required: true },
        tipohorario: { type: String, enum: ['Diurno', 'Nocturno'], required: true },
        precio: { type: Number, required: true },
      },
    ],
    required: true,
  })
  precios: Array<{
    idtipohorario: string;
    tipohorario: string;
    precio: number;
  }>;

  @Prop({ type: Number, default: 0 })
  precio_promedio: number;
}

export const ProductHashSchema = SchemaFactory.createForClass(ProductHash);