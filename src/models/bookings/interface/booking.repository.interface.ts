import { Person } from "../../person/schema/person.schema";
import { Booking } from "../booking.schema"; // Adjust the import path as necessary

export interface IBookingRepository {
  //getSession(): Promise<ClientSession>;
  findAll(): Promise<Booking[]>;
  findMyBookingsByCuil(cuil: number): Promise<Booking[]>;
  findByPassenger(passenger: string): Promise<Booking[]>;
  findByOwner(email: string): Promise<Booking[]>;
  find(field: Record<string, any>): Promise<Booking[]>;
  findById(id: string): Promise<Booking> ;
  create(booking: Booking): Promise<Booking>;
  update(booking: Booking) : Promise<Booking>;
  remove(id: string): Promise<boolean>;
  setStatus(id: string, status: string): Promise<Booking>;
  getAllPassengers(): Promise<Person[]>;
}
  // findByIdAndDriver(driver: string, id: string): Promise<Booking>;}