import { ClientSession } from "mongoose";
import { NewTripDTO } from "../dto/new-trip.dto";
import { TripStatus } from "../enums/state.enum";
import { Trip, TripDocument } from "../trip.schema";
import { User } from "../../users/user.schema"; // Adjust the import path as necessary

export interface ITripRepository {
  //getSession(): Promise<ClientSession>;
  findAll(): Promise<Trip[]>;
  findByDriver(driver: string): Promise<Trip[]>;
  find(field: Record<string, any>): Promise<Trip[]>;
  findByIdWithDriver(id: string): Promise<Trip> ;
  findById(id: string): Promise<Trip> ;
  findNonDriverTrips(email: string) : Promise<Trip[]>;
  create(trip: Trip): Promise<Trip>;
  update(trip: Trip) : Promise<Trip>;
  updateStatus(tripId: string, newStatus: TripStatus): Promise<Trip>;
  passengersByTrip(tripId: string): Promise<string[]>;
  getAllDrivers(): Promise<User[]>;
}
  // findByIdAndDriver(driver: string, id: string): Promise<Trip>;}