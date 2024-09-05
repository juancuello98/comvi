import { NewLocationDTO } from "../dto/new-location.dto";
import { Location, LocationDocument } from "../location-schema";

export interface ILocationRepository {
    create(createLocationDto: NewLocationDTO): Promise<LocationDocument>;
    findAll(): Promise<Location[]>;
    findById(id: string): Promise<Location>;
    update(id: string, updateLocationDto: NewLocationDTO): Promise<Location>;
    delete(id: string): Promise<void>;
  }