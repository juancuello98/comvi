import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document, model, Model, Schema as MongooseSchema } from 'mongoose';
import { Trip } from '../trips';
import { Luggages } from '../packages/luggage';
import { Packages } from '../packages/packages';
import { Person, PersonDocument } from '../person/schema/person.schema';

export type BookingDocument = Booking & Document;

@Schema({timestamps:true})
export class Booking {

 /*
 * ID de la reserva.
 */
  @Prop({ type: MongooseSchema.Types.ObjectId })
  id: string;
 
  /*
  * Mail del propietario de la reserva.
  */
  @Prop({ required: true , type: String, ref: 'User' })
  owner: string;
  
  /**
   * ID del viaje.
   */
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Trips' })
  trip: Trip|string;
 
  /*
  * Equipamiento de la reserva.
  */
  @Prop({ required: true, default:[], type:[Luggages] })
  equipment: Luggages[];

  /*
  * Paquetes de la reserva.
  */
  @Prop({ required: true, default:[], type:[Packages] })
  packajes: Packages[];

  /*
  * Pasajeros de la reserva.
  */
  @Prop({ required: true, default:[], type:[Person] })
  passengers: Person[];

  /*
  * Status de la reserva.
  */
  @Prop({ required: true })
  status: string;

  totalPassengers(): number{
    return this.passengers.length;
  } 
  
  
}


export const BookingSchema = SchemaFactory.createForClass(Booking);

// BookingSchema.pre<BookingDocument>('save', async function (next) {
//   const personModel = model(Person.name) as Model<PersonDocument>;
//   for (let i = 0; i < this.passengers.length; i++) {
//     const per = this.passengers[i];
//     const personExists = await personModel.exists({ dni: per.dni });

//   if (!personExists) {
//     await personModel.create({ dni: per.dni, name: per.name, birthday: per.birthday , lastname: per.lastname, picture: per.picture, });
//   }
//   }
//   next();
// });

//A corregir 
