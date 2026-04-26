import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {

    @Prop({ type: String, ref: '_id' })
    id: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    province: string;

    @Prop({ required: true })
    department: string;

    @Prop({ required: false, default: '' })
    locality: string;

    @Prop({ required: true })
    format_address: string;

    @Prop({ required: true })
    latitude: string;

    @Prop({ required: true })
    longitude: string;

    @Prop({ required: false, default: '' })
    place_id: string;
}

/**
Collection de Locations.
El schema le brinda propiedades a la clase Locations para interactuar con la base de datos
**/
export const LocationSchema = SchemaFactory.createForClass(Location);