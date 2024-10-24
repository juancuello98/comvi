import { ClientSession } from "mongoose";
import { NewResumeDTO } from "../dto/trip.resume.dto";
import { TripResumeDocument } from "../trip.resume.schema";

export interface ITripResumeRepository {
  getSession(): Promise<ClientSession>;
  findById(id: any): Promise<TripResumeDocument>;
  update(resume: TripResumeDocument): Promise<TripResumeDocument>;
  create(resume: NewResumeDTO): Promise<TripResumeDocument>;
}