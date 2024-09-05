import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicles.schema';
import { CommonModule } from 'src/common/common.module';
import { VehicleMongodbRepository } from './repository/vehicles.mongodb.repository';
import { IVEHICLE_REPOSITORY } from './repository/constants/vehicle.repository.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
    CommonModule,
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, {
    provide: IVEHICLE_REPOSITORY,
    useClass: VehicleMongodbRepository,
  }],
  exports: [VehiclesService],
})
export class VehiclesModule {}