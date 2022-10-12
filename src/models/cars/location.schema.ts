import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

//TODO: Collection de Vehicles
//TODO: El schema le brinda propiedades a la clase Vehicles para interactuar con la base de datos
@Schema()
export class Vehicle {

    @Prop({required: true}) // para propiedades requeridas
    brand  : string;
  
    @Prop({required: true}) // para propiedades requeridas
    model : string;

    @Prop({required: true}) // para propiedades requeridas
    version : string;

    @Prop({required: true}) // para propiedades requeridas
    capacity : number;


}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);