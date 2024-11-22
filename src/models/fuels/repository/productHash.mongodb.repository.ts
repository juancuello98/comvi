import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProductHashRepository } from "../interfaces/ProductHash.repository.interface";
import { ProductHash, ProductHashDocument } from "../schemas/ProductHashSchemas";   

export class ProductHashMongodbRepository implements IProductHashRepository {
    constructor(
        @InjectModel(ProductHash.name) private readonly ProductHashStationModel: Model<ProductHashDocument>,
          ) { }
    async findAll(): Promise<ProductHash[]> {
        return this.ProductHashStationModel.find().exec();
    }
    async create(createDto: ProductHash): Promise<ProductHash> {
       var created = new this.ProductHashStationModel(createDto);
       return created.save();
    }
    async findById(id: string): Promise<ProductHash> {
        var ProductHash = this.ProductHashStationModel.findById(id).exec();
        return ProductHash;
    }
    async update(id: string, updateDto: ProductHash): Promise<ProductHash> {
        var ProductHash = this.ProductHashStationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec(); 
        return ProductHash;
    }
    async delete(id: string): Promise<boolean> {
        var ProductHash =  this.ProductHashStationModel.findByIdAndDelete(id).exec();
        return ProductHash? true : false;

    }
  
  
}