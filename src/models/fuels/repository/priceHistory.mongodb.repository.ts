import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPriceHistoryRepository } from "../interfaces/PriceHistory.repository.interface";
import { PriceHistory, PriceHistoryDocument } from "../schemas/PriceHistorySchemas";   

export class PriceHistoryMongodbRepository implements IPriceHistoryRepository {
    constructor(
        @InjectModel(PriceHistory.name) private readonly PriceHistoryStationModel: Model<PriceHistoryDocument>,
          ) { }
    findByProductId(id: string): Promise<PriceHistory> {
        return this.PriceHistoryStationModel.findOne({ productoId: id }).exec();
    }
    async addPriceHistories(price: PriceHistory[]): Promise<PriceHistory[]> {
        const bulkOps = price.map(price => ({
            updateOne: {
                filter: { productoId: price.productoId },
                update: { $set: price },
                upsert: true
            }
        }));
        this.PriceHistoryStationModel.bulkWrite(bulkOps);
        return price;
    }
    async findAll(): Promise<PriceHistory[]> {
        return this.PriceHistoryStationModel.find().exec();
    }

    async find(params:{}): Promise<PriceHistory[]> {
        return this.PriceHistoryStationModel.find(params).exec();
    }
    async create(createDto: PriceHistory): Promise<PriceHistory> {
       var created = new this.PriceHistoryStationModel(createDto);
       return created.save();
    }
    async findById(id: string): Promise<PriceHistory> {
        var PriceHistory = this.PriceHistoryStationModel.findById(id).exec();
        return PriceHistory;
    }
    async update(id: string, updateDto: PriceHistory): Promise<PriceHistory> {
        var PriceHistory = this.PriceHistoryStationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec(); 
        return PriceHistory;
    }
    async delete(id: string): Promise<boolean> {
        var PriceHistory =  this.PriceHistoryStationModel.findByIdAndDelete(id).exec();
        return PriceHistory? true : false;

    }
  
  
}