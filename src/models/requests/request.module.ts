import { User, UserSchema } from '@/users/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { Trip, TripSchema } from '@/trips/trip.schema';	
import { TripModule } from '@/trips/trip.module';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './request.schema';
import { RequestService } from './request.service';
import { UserModule } from '@/users/user.module';
import { IREQUEST_REPOSITORY } from './repository/constants/request.repository.constant';
import { RequestMongodbRepository } from './repository/request.mongodb.repository';
import { TripResumeSchema } from '@/trips/resumes/trip.resume.schema';
import { LocationModule } from '@/locations/location.module';
@Module({
  imports: [MongooseModule.forFeature([
    { name: Request.name, schema: RequestSchema },
    {name: Trip.name, schema:TripSchema},
    {name: Trip.name, schema:TripResumeSchema},
    {name: User.name, schema:UserSchema}
  ]),
  CommonModule,
  TripModule,
  UserModule,
  LocationModule
],
  controllers: [RequestController],
  providers: [RequestService, RequestMongodbRepository, {
    provide: IREQUEST_REPOSITORY,
    useClass: RequestMongodbRepository,
  }],
  exports: [RequestService, RequestMongodbRepository, IREQUEST_REPOSITORY],
})
export class RequestModule {}
