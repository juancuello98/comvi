
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { TransactionModule } from '../transactions/transactions.module';
import { Trip, TripSchema } from '../trips/trip.schema';
import { User, UserSchema } from '../users/user.schema';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './request.schema';
import { RequestService } from './request.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Request.name, schema: RequestSchema },
    {name: Trip.name, schema:TripSchema},
    {name: User.name, schema:UserSchema}
  ]),
  CommonModule,
  TransactionModule
],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}