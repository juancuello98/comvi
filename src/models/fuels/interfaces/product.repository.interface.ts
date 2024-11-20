import { Product } from "../schemas/ProductSchemas";

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    create(createDto: Product): Promise<Product>;
    findById(id: string): Promise<Product>;
    update(id: string, updateDto: Product): Promise<Product>;
    delete(id: string): Promise<boolean>;
    addProducts(companies: Product[]): Promise<Product[]>;
  }