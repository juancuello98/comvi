
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { UserModule } from '../users/user.module';
import { TripController } from './trip.controller';
import { Trip, TripSchema } from './trip.schema';
import { TripService } from './trip.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  UserModule,CommonModule
],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}