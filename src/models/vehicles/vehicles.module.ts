import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicles , VehiclesSchema } from './vehicles.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicles.name, schema: VehiclesSchema }])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule {}

