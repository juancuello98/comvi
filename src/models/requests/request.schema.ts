import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestDocument = Request & Document;

//TODO: Collection de Requests
//TODO: El schema le brinda propiedades a la clase Requests para interactuar con la base de datos
@Schema()
export class Request {

    @Prop({required: true}) // para propiedades requeridas
    email : string;
  
    @Prop({required: true}) // para propiedades requeridas
    tripId : string;

    @Prop({required: true}) // para propiedades requeridas
    description : string;

    @Prop({required: true}) // para propiedades requeridas
    hasEquipment : boolean;    

    @Prop({required: true}) // para propiedades requeridas
    hasPartner : boolean;

    @Prop({required: false}) // para propiedades requeridas
    partnerQuantity : number;

    @Prop({required: true})
    totalPassenger : number;

    @Prop({required: true})
    createdTimestamp : string;

    @Prop({required: true})
    status : string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);