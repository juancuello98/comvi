import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { User, UserSchema } from '../users/user.schema';
import { TripController } from './trip.controller';
import { TripResume, TripResumeSchema } from './resumes/trip.resume.schema';
import { Trip, TripSchema } from './trip.schema';
import { TripService } from './trip.service';
import { TripResumeRepository } from './resumes/trip.resume.repository';
import { TripMongodbRepository } from './repository/trip.mongodb.repository';
import { ITRIP_REPOSITORY } from './repository/constants/trip.repository.constant';
import { UserModule } from '../users/user.module';
import { LocationModule } from '../locations/location.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trip.name, schema: TripSchema },
      { name: TripResume.name, schema: TripResumeSchema },
    ]),
    CommonModule,
    UserModule,
    LocationModule
  ],
  controllers: [TripController],
  providers: [TripService, TripResumeRepository, {
    provide: ITRIP_REPOSITORY,
    useClass: TripMongodbRepository,
  }],
  exports: [TripService],
})
export class TripModule {}
