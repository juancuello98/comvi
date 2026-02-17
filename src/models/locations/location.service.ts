import { NewLocationDTO } from "./dto/new-location.dto";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ILocationRepository } from "./interfaces/location.repository.interface";
import { ILOCATION_REPOSITORY } from "./repository/constants/location.repository.constant";
import { Location } from "./location-schema";

/**
 * Servicio de ubicaciones - Lógica de negocio
 * Trabaja con objetos planos (Location), no con documentos de Mongoose
 */
@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

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

  // ============================================
  // BUSINESS LOGIC METHODS
  // ============================================

  /**
   * Buscar ubicaciones cercanas a una coordenada
   */
  async findNearby(
    longitude: number,
    latitude: number,
    maxDistanceKm: number = 10
  ): Promise<Location[]> {
    try {
      this.logger.log(`Searching locations near [${longitude}, ${latitude}] within ${maxDistanceKm}km`);
      return await this.locationRepository.findNearby(longitude, latitude, maxDistanceKm);
    } catch (error) {
      this.logger.error(`Error finding nearby locations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Búsqueda full-text de ubicaciones
   */
  async searchByText(searchTerm: string): Promise<Location[]> {
    try {
      this.logger.log(`Full-text search for locations: ${searchTerm}`);
      return await this.locationRepository.searchByText(searchTerm);
    } catch (error) {
      this.logger.error(`Error searching locations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener ubicaciones más populares
   */
  async getPopular(limit: number = 10): Promise<Location[]> {
    try {
      return await this.locationRepository.getPopular(limit);
    } catch (error) {
      this.logger.error(`Error getting popular locations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Incrementar contador de uso de una ubicación
   */
  async incrementUsage(placeId: string): Promise<void> {
    try {
      await this.locationRepository.incrementUsage(placeId);
      this.logger.log(`Incremented usage count for location ${placeId}`);
    } catch (error) {
      this.logger.error(`Error incrementing location usage: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calcular distancia entre dos ubicaciones (fórmula de Haversine)
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }
}