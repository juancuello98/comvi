import { ClientSession } from "mongoose";
import { NewTripDTO } from "../dto/new-trip.dto";
import { TripStatus } from "../enums/state.enum";
import { Trip, TripDocument } from "../trip.schema";

export interface ITripRepository {
  getSession(): Promise<ClientSession>;
  findByDriver(driver: string): Promise<TripDocument[]|any[]>;
  find(field: Record<string, any>): Promise<TripDocument[]|any[]>;
  findByIdWithDriver(id: string): Promise<TripDocument|any> ;
  findById(id: string): Promise<TripDocument|any> ;
  findNonDriverTrips(email: string) : Promise<TripDocument[]|any[]>;
  create(trip: NewTripDTO): Promise<TripDocument|any>;
  update(trip: Trip) : Promise<TripDocument>;
  updateStatus(tripId: string, newStatus: TripStatus): Promise<TripDocument|any>;
  findByIdAndDriver(driver: string, id: string): Promise<TripDocument|any>;
  findByDriver(driver: string): Promise<TripDocument[]|any[]>;
  find(field: Record<string, any>): Promise<TripDocument[]|any[]>;
  findByIdWithDriver(id: string): Promise<TripDocument|any> ;
  findById(id: string): Promise<TripDocument|any> ;
  findAll(): Promise<TripDocument|any> ;
  findNonDriverTrips(email: string) : Promise<TripDocument[]|any[]>;
  create(trip: NewTripDTO): Promise<TripDocument|any>;
  update(trip: Trip) : Promise<TripDocument>;
  updateStatus(tripId: string, newStatus: TripStatus): Promise<TripDocument|any>;
  findByIdAndDriver(driver: string, id: string): Promise<TripDocument|any>;
  passengersByTrip( id: string): Promise<any> 
  }