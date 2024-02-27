import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Puntaje } from './puntaje.enums';

export type ValuationDocument = Valuation & Document;

//TODO: Collection de Trips
//TODO: El schema le brinda propiedades a la clase Trips para interactuar con la base de datos
@Schema()
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

export const ValuationSchema = SchemaFactory.createForClass(Valuation);