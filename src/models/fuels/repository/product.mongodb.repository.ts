import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IProductRepository } from "../interfaces/product.repository.interface";
import { Product, ProductDocument } from "../schemas/ProductSchemas";   

export class ProductMongodbRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name) private readonly ProductStationModel: Model<ProductDocument>,
          ) { }
    async addProducts(products: Product[]): Promise<Product[]> {
        const bulkOps = products.map(product => ({
            updateOne: {
                filter: { idproducto: product.idproducto },
                update: { $set: product },
                upsert: true
            }
        }));
        await this.ProductStationModel.bulkWrite(bulkOps);
        return products;
    }
    async findAll(): Promise<Product[]> {
        return this.ProductStationModel.find().exec();
    }
    async create(createDto: Product): Promise<Product> {
       var created = new this.ProductStationModel(createDto);
       return created.save();
    }
    async findById(id: string): Promise<Product> {
        var Product = this.ProductStationModel.findById(id).exec();
        return Product;
    }
    async update(id: string, updateDto: Product): Promise<Product> {
        var Product = this.ProductStationModel.findByIdAndUpdate(id, updateDto, { new: true }).exec(); 
        return Product;
    }
    async delete(id: string): Promise<boolean> {
        var Product =  this.ProductStationModel.findByIdAndDelete(id).exec();
        return Product? true : false;

    }
    
  
  
}