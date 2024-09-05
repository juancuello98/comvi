import { NewTripDTO } from "../dto/new-trip.dto";
import { TripStatus } from "../enums/state.enum";
import { Trip } from "../trip.schema";

export interface ITripRepository {
  findByDriver(driver: string): Promise<Trip[]>;
  find(field: Record<string, any>): Promise<Trip[]>;
  findByIdWithDriver(id: string): Promise<Trip> ;
  findById(id: string): Promise<Trip> ;
  findNonDriverTrips(email: string) : Promise<Trip[]>;
  create(trip: NewTripDTO): Promise<Trip>;
  update(trip: Trip) : Promise<Trip>;
  updateStatus(tripId: string, newStatus: TripStatus): Promise<Trip>;
  findByIdAndDriver(driver: string, id: string): Promise<Trip>;
  passengersByTrip( id: string): Promise<Trip> 
  }