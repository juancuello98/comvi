import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IFuelsStationRepository } from "../interfaces/fuelsStation.repository.interface";
import { FuelsStation, FuelsStationDocument } from "../schemas/FuelsStationSchemas";   

export class FuelsStationMongodbRepository implements IFuelsStationRepository {
    constructor(
        @InjectModel(FuelsStation.name) private readonly FuelsStationStationModel: Model<FuelsStationDocument>,
          ) { }
    async findAll(): Promise<FuelsStation[]> {
        return this.FuelsStationStationModel.find().exec();
    }
    async create(createDto: FuelsStation): Promise<FuelsStation> {
       var created = new this.FuelsStationStationModel(createDto);
       return created.save();
    }
    async findById(id: string): Promise<FuelsStation> {
        var FuelsStation = this.FuelsStationStationModel.findById(id).exec();
        return FuelsStation;
    }
    async update(id: string, updateDto: FuelsStation): Promise<FuelsStation> {
        var FuelsStation = this.FuelsStationStationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec(); 
        return FuelsStation;
    }
    async delete(id: string): Promise<boolean> {
        var FuelsStation =  this.FuelsStationStationModel.findByIdAndDelete(id).exec();
        return FuelsStation? true : false;
    }
  
    async addCompanies(companies: FuelsStation[]): Promise<FuelsStation[]> {
        const bulkOps = companies.map(FuelsStation => ({
            updateOne: {
                filter: { FuelsStationId: FuelsStation.stationId },
                update: { $set: FuelsStation },
                upsert: true
            }
        }));
        await this.FuelsStationStationModel.bulkWrite(bulkOps);
        return companies;
    }

}