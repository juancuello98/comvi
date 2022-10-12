import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehiclesDocument = Vehicles & Document;


@Schema()
export class Vehicles {

    @Prop({required: true}) // para propiedades requeridas
    id : string;
  
    @Prop({required: true}) 
    patentPlate : string;

    @Prop({required: true}) 
    model : string;

    @Prop({required: true}) 
    brand : string;

    pics : string []; //urls de imagenes
    
    @Prop({required: true}) 
    email: string;

    color: string;
    //documentacion?
}

export const VehiclesSchema = SchemaFactory.createForClass(Vehicles);