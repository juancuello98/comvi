import { PriceHistory } from "../schemas/PriceHistorySchemas";

export interface IPriceHistoryRepository {
    addPriceHistories(pr: PriceHistory[]): Promise<PriceHistory[]>;
    findAll(): Promise<PriceHistory[]>;
    create(createDto: PriceHistory): Promise<PriceHistory>;
    findById(id: string): Promise<PriceHistory>;
    findByProductId(id: string): Promise<PriceHistory>;
    update(id: string, updateDto: PriceHistory): Promise<PriceHistory>;
    delete(id: string): Promise<boolean>;
  }