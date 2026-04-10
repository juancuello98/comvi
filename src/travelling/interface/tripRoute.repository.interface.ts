import { TripRoute } from "../tripRoute.schema";
export interface ITripRouteRepository {
  findById(id: any): Promise<TripRoute>;
  findByIdWithStations(id: any): Promise<TripRoute>;
  update(resume: TripRoute): Promise<TripRoute>;
  create(resume: TripRoute): Promise<TripRoute>;
}