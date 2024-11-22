import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PriceHistoryDocument = PriceHistory & Document;

@Schema({ timestamps: true })
export class PriceHistory {
  
  @Prop({ type: String, ref: 'Product', required: true })
  productoId: string;
  
  @Prop({ required: true })
  fecha_vigencia: string;
  
  @Prop({
    type: [
      {
        empresaId: { type: String, ref: 'Company.companyId', required: true },
        idtipohorario: { type: String, required: true },
        tipohorario: { type: String, enum: ['Diurno', 'Nocturno'], required: true },
        precio: { type: Number, required: true },
      },
    ],
    required: true,
  })
  precios: Array<{
    empresaId: string;
    idtipohorario: string;
    tipohorario: string;
    precio: number;
  }>;

  @Prop({ type: Number, default: 0 })
  precio_promedioDía: number;
  @Prop({ type: Number, default: 0 })
  precio_promedioNoche: number;
  @Prop({ type: Number, default: 0 })
  precio_promedio: number;
}

export const PriceHistorySchema = SchemaFactory.createForClass(PriceHistory);