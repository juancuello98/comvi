import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestDocument = Request & Document;

//TODO: Collection de Requests
//TODO: El schema le brinda propiedades a la clase Requests para interactuar con la base de datos
@Schema()
export class Request {

    @Prop({required: true}) // para propiedades requeridas
    nombre : string;
  
    @Prop({required: true}) // para propiedades requeridas
    coordenadas : string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);