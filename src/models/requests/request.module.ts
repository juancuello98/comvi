import { User, UserSchema } from '../users/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { Trip, TripSchema } from '../trips/trip.schema';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './request.schema';
import { RequestService } from './request.service';
import { UserModule } from '../users/user.module';
import { TripModule } from '../trips/trip.module';
import { Location, LocationSchema } from '../locations/location-schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Request.name, schema: RequestSchema },
    { name: Trip.name, schema: TripSchema },
    { name: User.name, schema: UserSchema },
    { name: Location.name, schema: LocationSchema },
  ]),
  CommonModule,
  UserModule,
  TripModule
],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
