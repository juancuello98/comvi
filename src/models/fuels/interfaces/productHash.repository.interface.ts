import { ProductHash } from "../schemas/ProductHashSchemas";

export interface IProductHashRepository {
    findAll(): Promise<ProductHash[]>;
    create(createDto: ProductHash): Promise<ProductHash>;
    findById(id: string): Promise<ProductHash>;
    update(id: string, updateDto: ProductHash): Promise<ProductHash>;
    delete(id: string): Promise<boolean>;
  }