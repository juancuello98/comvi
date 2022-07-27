import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

//TODO: Collection de Locations
//TODO: El schema le brinda propiedades a la clase Locations para interactuar con la base de datos
@Schema()
export class Location {

    @Prop({required: true}) // para propiedades requeridas
    nombre : string;
  
    @Prop({required: true}) // para propiedades requeridas
    coordenadas : string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);