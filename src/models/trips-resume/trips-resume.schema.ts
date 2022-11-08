import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripResumeDocument = TripResume & Document;

//TODO: Collection de Trips
//TODO: El schema le brinda propiedades a la clase Trips para interactuar con la base de datos
@Schema()
export class TripResume {

    @Prop({required : true})
    passengers: string []

    @Prop()
    valoraciones : string [];

    @Prop({required: true}) 
    fechaHoraRealInicio : string;

    @Prop()
    fechaHoraRealFin : boolean;
}

export const TripResumeSchema = SchemaFactory.createForClass(TripResume);