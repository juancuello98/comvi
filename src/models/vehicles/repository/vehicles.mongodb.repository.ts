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

    async create(createVehicleDto: CreateVehicleDto, email: string): Promise<Vehicle> {
        try {
            return await this.vehiclesModel.create({...createVehicleDto, email});
        } catch (error) {
            throw MongoDuplicateKeyError.isMongodbError(error)
        }
    }

    async update(patent: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
        const vehicle = await this.vehiclesModel
        .findOneAndUpdate(
            {patentPlate: patent},
            {$set: {...updateVehicleDto} },
            {new: true}
        ).exec();
        return vehicle;
    }

    async findByPatent(patent: string): Promise<Vehicle> {
        const vehicle = await this.vehiclesModel.findOne({patentPlate: patent}).exec();
        return vehicle;
    }

    async findByUser(email: string): Promise<Vehicle[]> {
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