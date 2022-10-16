import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { UserModule } from '../users/user.module';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicles , VehiclesSchema } from './vehicles.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicles.name, schema: VehiclesSchema }]), UserModule ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule {}

