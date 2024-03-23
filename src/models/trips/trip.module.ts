import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { User, UserSchema } from '../users/user.schema';
import { TripController } from './trip.controller';
import { TripResume, TripResumeSchema } from './resumes/trip.resume.schema';
import { Trip, TripSchema } from './trip.schema';
import { TripService } from './trip.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trip.name, schema: TripSchema },
      { name: TripResume.name, schema: TripResumeSchema },
    ]),
    CommonModule,
  ],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
