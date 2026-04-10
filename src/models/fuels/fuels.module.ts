import { Module } from '@nestjs/common';
import { FuelService } from './fuels.service';
import { FuelsController } from './fuels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelsStation, FuelsStationSchema } from './schemas/FuelsStationSchemas';
import { FuelsStationMongodbRepository } from './repository/fuelsStation.mongodb.repository';
import { PriceHistory, PriceHistorySchema } from './schemas/PriceHistorySchemas';
import { Product, ProductSchema } from './schemas/ProductSchemas';
import { ProductMongodbRepository } from './repository/product.mongodb.repository';
import { PriceHistoryMongodbRepository } from './repository/priceHistory.mongodb.repository';
import { IFUELSSTATION_REPOSITORY } from './repository/constants/fuelsStation.repository.constant';
import { IPRICEHISTORY_REPOSITORY } from './repository/constants/priceHistory.repository.constant';
import { IPRODUCT_REPOSITORY } from './repository/constants/product.repository.constant';

@Module({
  imports: [MongooseModule.forFeature([
    {name: FuelsStation.name, schema:FuelsStationSchema},
    {name: PriceHistory.name, schema:PriceHistorySchema},
    {name: Product.name, schema:ProductSchema}
  ])
],
  controllers: [
    FuelsController],
  providers: [FuelService,
    {
      provide: IFUELSSTATION_REPOSITORY,
      useClass: FuelsStationMongodbRepository,
    },
    {
      provide: IPRODUCT_REPOSITORY,
      useClass: ProductMongodbRepository,
    },
    {
      provide: IPRICEHISTORY_REPOSITORY,
      useClass: PriceHistoryMongodbRepository,}
  ],
  exports: [FuelService],
})
export class FuelsModule {}
