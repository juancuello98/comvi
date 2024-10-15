import { NewTripDTO } from "../dto/new-trip.dto";
import { TripStatus } from "../enums/state.enum";
import { Trip } from "../trip.schema";

export interface ITripRepository {
  findByDriver(driver: string): Promise<Trip[]|any[]>;
  find(field: Record<string, any>): Promise<Trip[]|any[]>;
  findByIdWithDriver(id: string): Promise<Trip|any> ;
  findById(id: string): Promise<Trip|any> ;
  findNonDriverTrips(email: string) : Promise<Trip[]|any[]>;
  create(trip: NewTripDTO): Promise<Trip|any>;
  update(trip: Trip) : Promise<Trip>;
  updateStatus(tripId: string, newStatus: TripStatus): Promise<Trip|any>;
  findByIdAndDriver(driver: string, id: string): Promise<Trip|any>;
  passengersByTrip( id: string): Promise<any> 
  }