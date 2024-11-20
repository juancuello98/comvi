import { NewLocationDTO } from "./dto/new-location.dto";
import * as geolib from 'geolib';
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

  async create(createLocationDto: NewLocationDTO): Promise<Location> {
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

  getDisntance(origin: Location, destiny: Location): number {
    
    const pointA = { latitude: origin.latitude, longitude: origin.longitude }; 
    const pointB = { latitude: destiny.latitude , longitude: destiny.longitude }; 

    // Calcular distancia en metros
    const distanceMeters = geolib.getDistance(pointA, pointB);

    // Convertir a kilómetros
    const distanceKilometers = geolib.convertDistance(distanceMeters, 'km');

    return distanceKilometers;
  }

}