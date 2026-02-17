import { InjectModel } from "@nestjs/mongoose";
import { NewLocationDTO } from "../dto/new-location.dto";
import { ILocationRepository } from "../interfaces/location.repository.interface";
import { Location, LocationDocument } from "../location-schema";
import { Model } from "mongoose";

/**
 * Repositorio de ubicaciones - Solo acceso a datos
 * Siempre retorna objetos planos (no Mongoose documents)
 */
export class LocationMongoDBRepository implements ILocationRepository {
    constructor(
        @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>
    ) {}

    async create(createLocationDto: NewLocationDTO): Promise<Location> {
        // Convert latitude/longitude to numbers if they're strings
        const locationData = {
            ...createLocationDto,
            latitude: typeof createLocationDto.latitude === 'string' 
                ? parseFloat(createLocationDto.latitude) 
                : createLocationDto.latitude,
            longitude: typeof createLocationDto.longitude === 'string' 
                ? parseFloat(createLocationDto.longitude) 
                : createLocationDto.longitude,
        };
        const created = await this.locationModel.create(locationData as any);
        const createdDoc = Array.isArray(created) ? created[0] : created;
        // Convertir a objeto plano
        return createdDoc.toObject() as Location;
    }

    async findAll(): Promise<Location[]> {
        const locations = await this.locationModel
            .find()
            .lean() // Retornar objetos planos
            .exec();
        return locations as Location[];
    }

    async findById(id: string): Promise<Location | null> {
        const location = await this.locationModel
            .findOne({place_id: id})
            .lean() // Retornar objeto plano
            .exec();
        return location as Location;
    }

    async update(id: string, updateLocationDto: NewLocationDTO): Promise<Location | null> {
        const updated = await this.locationModel
            .findOneAndUpdate({place_id: id}, updateLocationDto, { new: true })
            .lean() // Retornar objeto plano
            .exec();
        return updated as Location;
    }

    async delete(id: string): Promise<void> {
        await this.locationModel.findOneAndDelete({place_id: id}).exec();
    }

    async findNearby(longitude: number, latitude: number, maxDistanceKm: number = 10): Promise<Location[]> {
        const locations = await this.locationModel
            .find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: maxDistanceKm * 1000,
                    },
                },
            })
            .limit(10)
            .lean() // Retornar objetos planos
            .exec();
        return locations as Location[];
    }

    async searchByText(searchTerm: string): Promise<Location[]> {
        const locations = await this.locationModel
            .find({ $text: { $search: searchTerm } })
            .select({ score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(10)
            .lean() // Retornar objetos planos
            .exec();
        return locations as Location[];
    }

    async getPopular(limit: number = 10): Promise<Location[]> {
        const locations = await this.locationModel
            .find()
            .sort({ usageCount: -1 })
            .limit(limit)
            .lean() // Retornar objetos planos
            .exec();
        return locations as Location[];
    }

    async incrementUsage(placeId: string): Promise<void> {
        await this.locationModel
            .findOneAndUpdate(
                { place_id: placeId },
                { $inc: { usageCount: 1 } }
            )
            .exec();
    }
}