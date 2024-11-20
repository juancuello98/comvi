import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { User, UserSchema } from '../users/user.schema';
import { TripController } from './trip.controller';
import { TripResume, TripResumeSchema } from './resumes/trip.resume.schema';
import { Trip, TripSchema } from './trip.schema';
import { TripService } from './trip.service';
import { TripResumeRepository } from './resumes/repository/trip.resume.repository';
import { TripMongodbRepository } from './repository/trip.mongodb.repository';
import { ITRIP_REPOSITORY } from './repository/constants/trip.repository.constant';
import { UserModule } from '../users/user.module';
import { LocationModule } from '../locations/location.module';
import { ITRIP_RESUME_REPOSITORY } from './resumes/repository/constants/trip.resume.repository.constant';
import { VehiclesModule } from '@/vehicles/vehicles.module';
import { TripResumeService } from './resumes/tripResume.service';
import { FuelsModule } from '../fuels/fuels.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trip.name, schema: TripSchema },
      { name: TripResume.name, schema: TripResumeSchema },
    ]),
    CommonModule,
    UserModule,
    VehiclesModule,
    LocationModule,
    FuelsModule
  ],
  controllers: [TripController],
  providers: [
    TripService, TripResumeService, 
    {
      provide: ITRIP_REPOSITORY,
      useClass: TripMongodbRepository,
    },
    {
      provide: ITRIP_RESUME_REPOSITORY,
      useClass: TripResumeRepository,
    }
  ],
  exports: [
    TripService,
    TripResumeService,
    ITRIP_RESUME_REPOSITORY,
    ITRIP_REPOSITORY
  ],
})
export class TripModule {}