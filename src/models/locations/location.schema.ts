import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

//TODO: Collection de Locations
//TODO: El schema le brinda propiedades a la clase Locations para interactuar con la base de datos
@Schema()
export class Location {

    @Prop({required: true}) 
    country : string;
  
    @Prop({required: true}) 
    province : string;

    @Prop({required: true}) 
    departament : string;

    @Prop({required: true})
    locality : string;

    @Prop({required: true}) 
    format_address : string;

    @Prop({required: true}) 
    latitud : string;

    @Prop({required: true}) 
    longitud : string;

    @Prop({required: true})
    place_id : string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);