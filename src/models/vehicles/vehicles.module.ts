import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicles , VehiclesSchema } from './vehicles.schema'
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicles.name, schema: VehiclesSchema }]), CommonModule ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule {}

