import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripDocument = Trip & Document;

//TODO: Collection de Trips
//TODO: El schema le brinda propiedades a la clase Trips para interactuar con la base de datos
@Schema()
export class Trip {

    @Prop({required: true}) // para propiedades requeridas
    nombre : string;
  
    @Prop({required: true}) // para propiedades requeridas
    coordenadas : string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);