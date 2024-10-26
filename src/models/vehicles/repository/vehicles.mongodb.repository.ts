import { InjectModel } from "@nestjs/mongoose";
import { Vehicle, VehicleDocument } from "../vehicles.schema";
import { Model } from "mongoose";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";
import { IVehicleRepository } from "../interfaces/vehicle.repository.interface";
import { MongoDuplicateKeyError } from "@/common/error/mongodb.errors";

export class VehicleMongodbRepository implements IVehicleRepository {
    constructor(
        @InjectModel(Vehicle.name) private readonly vehiclesModel: Model<VehicleDocument>,
    ) { }
    getDocument(vehicle: VehicleDocument): Vehicle {
        
        return{
            patentPlate: vehicle.patentPlate,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            email: vehicle.email,
            pics: vehicle.pics,
            color: vehicle.color
        }
    }

    async create(createVehicleDto: CreateVehicleDto, email: string): Promise<VehicleDocument> {
        try {
            return await this.vehiclesModel.create({...createVehicleDto, email});
        } catch (error) {
            throw MongoDuplicateKeyError.isMongodbError(error)
        }
    }

    async update(patent: string, updateVehicleDto: UpdateVehicleDto): Promise<VehicleDocument> {
        const vehicle = await this.vehiclesModel
        .findOneAndUpdate(
            {patentPlate: patent},
            {$set: {...updateVehicleDto} },
            {new: true}
        ).exec();
        return vehicle;
    }

    async findByPatent(patent: string): Promise<VehicleDocument> {
        const vehicle = await this.vehiclesModel.findOne({patentPlate: patent}).exec();
        return vehicle;
    }

    async findByUser(email: string): Promise<VehicleDocument[]> {
        const vehicles = await this.vehiclesModel.find({ email }).exec();
        return vehicles;
    }

    async delete(patent: string) {
        try {
            await this.vehiclesModel.deleteOne({ patentPlate: patent });
        } catch (error) {
            throw error
        }
    }
}