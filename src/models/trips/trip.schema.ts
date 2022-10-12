import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Vehicle } from '../cars/location.schema';
import { Location } from '../locations/location.schema';
import { User } from '../users/user.schema';
import { TripStatus } from './enums/state.enum';

export type TripDocument = Trip & Document;

//TODO: Collection de Trips
//TODO: El schema le brinda propiedades a la clase Trips para interactuar con la base de datos
@Schema()
export class Trip {

    @Prop({required: true}) // para propiedades requeridas
    origin : Location;
  
    @Prop({required: true}) 
    destination : Location;

    @Prop({required: true}) 
    allowPackage : boolean;

    @Prop({required: true}) 
    allowPassenger : boolean;

    @Prop({required: true}) 
    peopleQuantity : number;

    @Prop({required: true}) 
    vehicle: Vehicle;

    @Prop({required: true}) 
    driverEmail : string;
    
    @Prop({required: true}) 
    checkIn: string
    
    @Prop({required: true}) 
    status: TripStatus

    passengers : string [] //va a ir un array con los ids de los usuarios para no replicar data

    paquetes: string [] // id de los paquetes que van a ir en el viaje

    estimatedCosts: number

    kilometers: number

    createdTimestamp: string

    tripsRequests : string [] // array con los ids de las solicitudes

    valuations : string [] // id de las valuaciones que van a ser consultadas por otros servicios
}

export const TripSchema = SchemaFactory.createForClass(Trip);