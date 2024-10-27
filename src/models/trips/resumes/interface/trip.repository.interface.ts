import { ClientSession } from "mongoose";
import { NewResumeDTO } from "../dto/trip.resume.dto";
import { TripResume, TripResumeDocument } from "../trip.resume.schema";

export interface ITripResumeRepository {
  findById(id: any): Promise<TripResume>;
  update(resume: TripResume, id: string): Promise<TripResume>;
  create(resume: TripResume): Promise<TripResume>;
}