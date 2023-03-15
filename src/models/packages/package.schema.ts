import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageDocument = Package & Document;

//TODO: Collection de Packages
//TODO: El schema le brinda propiedades a la clase Packages para interactuar con la base de datos
@Schema()
export class Package {

    @Prop({required: true}) // para propiedades requeridas
    nombre : string;
  
    @Prop({required: true}) // para propiedades requeridas
    coordenadas : string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);