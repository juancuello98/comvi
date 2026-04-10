// import { TripReseume, TripResumeDocument } from '@/models/trips/resumes/trip.resume.schema';	
// import { NewTripDTO } from "@/trips/dto/new-trip.dto";
import { TripResumeDocument, TripResume } from "../trip.resume.schema";
import { ClientSession } from "mongoose";

export interface ITripResumeRepository {
  // findByDriver(driver: string): Promise<TripResumeDocument[]|any[]>;
  // find(field: Record<string, any>): Promise<TripResumeDocument[]|any[]>;
  // findByIdWithDriver(id: string): Promise<TripResumeDocument|any> ;
  findById(id: string): Promise<TripResume> ;
  findAll(): Promise<TripResume[]> ;
  // findNonDriverTrips(email: string) : Promise<TripResumeDocument[]|any[]>;
  create(resume: TripResume): Promise<TripResume>;
  update(resume: TripResume) : Promise<TripResume>;
  // updateStatus(tripId: string, newStatus: TripStatus): Promise<TripResumeDocument|any>;
  // findByIdAndDriver(driver: string, id: string): Promise<TripResumeDocument|any>;
  // passengersByTrip( id: string): Promise<any> 
  }