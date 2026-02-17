import { NewLocationDTO } from "../dto/new-location.dto";
import { Location } from "../location-schema";

/**
 * Interfaz del repositorio de ubicaciones
 * Todos los métodos retornan objetos planos (Location), no documentos de Mongoose
 */
export interface ILocationRepository {
    create(createLocationDto: NewLocationDTO): Promise<Location>;
    findAll(): Promise<Location[]>;
    findById(id: string): Promise<Location | null>;
    update(id: string, updateLocationDto: NewLocationDTO): Promise<Location | null>;
    delete(id: string): Promise<void>;
    findNearby(longitude: number, latitude: number, maxDistanceKm?: number): Promise<Location[]>;
    searchByText(searchTerm: string): Promise<Location[]>;
    getPopular(limit?: number): Promise<Location[]>;
    incrementUsage(placeId: string): Promise<void>;
  }