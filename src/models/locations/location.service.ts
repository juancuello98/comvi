import { NewLocationDTO } from "./dto/new-location.dto";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ILocationRepository } from "./interfaces/location.repository.interface";
import { ILOCATION_REPOSITORY } from "./repository/constants/location.repository.constant";
import { Location, LocationDocument } from "./location-schema";

@Injectable()
export class LocationService {
  constructor(
    @Inject(ILOCATION_REPOSITORY)
    private readonly locationRepository: ILocationRepository,
  ) {}

  async create(createLocationDto: NewLocationDTO): Promise<LocationDocument> {
    return this.locationRepository.create(createLocationDto);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: string, updateLocationDto: NewLocationDTO): Promise<Location> {
    const updatedLocation = await this.locationRepository.update(id, updateLocationDto);
    if (!updatedLocation) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return updatedLocation;
  }

  async delete(id: string): Promise<void> {
    await this.locationRepository.delete(id);
  }
}