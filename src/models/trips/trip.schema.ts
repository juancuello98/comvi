import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TripDocument = Trip & Document;

//TODO: Collection de Trips
//TODO: El schema le brinda propiedades a la clase Trips para interactuar con la base de datos
@Schema()
export class Trip {

    @Prop({required: true}) // para propiedades requeridas
    originId : string;
  
    @Prop({required: true}) 
    destinationId : string;

    @Prop({required: true}) 
    peopleCapacity : number;

    @Prop({required: true}) 
    driverId : string;

    @Prop({required: true}) 
    checkOut : string
    
    @Prop({required: true}) 
    checkIn: string
    
    @Prop({required: true}) 
    status: string

    passengers : string [] //va a ir un array con los ids de los usuarios para no replicar data

    paquetes: string [] // id de los paquetes que van a ir en el viaje

    estimatedCosts: number

    kilometros: number

    requests : string [] // array con los ids de las solicitudes

    valuations : string [] // id de las valuaciones que van a ser consultadas por otros servicios
}

export const TripSchema = SchemaFactory.createForClass(Trip);