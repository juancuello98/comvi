import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Puntaje } from './puntaje.enums';

export type ValuationDocument = Document<Valuation>;

@Schema() // Marca una clase como definición de esquema
// @Prop : Define una propiedad en el documento

export class Valuation {

    @Prop({required : true})
    email: string

    @Prop({required : true})
    tripId: string

    @Prop()
    detalle : string ;

    @Prop({required: true}) 
    fechaHoraCreado : string;

    @Prop({required: true}) 
    fechaHoraModificado : string;

    @Prop({required: true})
    puntaje : Puntaje;
}

export const ValuationSchema = SchemaFactory.createForClass(Valuation); // Asigna nuestra Catclase a una colección MongoDB del mismo nombre, pero con una “s” adicional al final, por lo que el nombre final de la colección mongo será cats