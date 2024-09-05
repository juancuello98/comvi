import { InjectModel } from "@nestjs/mongoose";
import { NewLocationDTO } from "../dto/new-location.dto";
import { ILocationRepository } from "../interfaces/location.repository.interface";
import { Location, LocationDocument } from "../location-schema";
import { Model } from "mongoose";

export class LocationMongoDBRepository implements ILocationRepository {
    constructor(
        @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>
    ) {
    }
    async create(createLocationDto: NewLocationDTO): Promise<LocationDocument> {
        return await this.locationModel.create(createLocationDto);
    }
    async findAll(): Promise<Location[]> {
        return this.locationModel.find().exec();
    }
    async findById(id: string): Promise<Location> {
        return this.locationModel.findOne({place_id: id}).exec();
    }
    async update(id: string, updateLocationDto: NewLocationDTO): Promise<Location> {
        return this.locationModel.findOneAndUpdate({place_id: id}, updateLocationDto, { new: true }).exec();
    }
    async delete(id: string): Promise<void> {
        await this.locationModel.findOneAndDelete({place_id: id}).exec();
    }
}