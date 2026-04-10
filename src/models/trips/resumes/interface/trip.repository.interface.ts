import { TripResume } from "../trip.resume.schema";

export interface ITripResumeRepository {
  findById(id: any): Promise<TripResume>;
  update(resume: TripResume): Promise<TripResume>;
  create(resume: TripResume): Promise<TripResume>;
}