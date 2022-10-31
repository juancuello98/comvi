
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { Trip, TripSchema } from '../trips/trip.schema';
import { User, UserSchema } from '../users/user.schema';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
    {name: Trip.name, schema:TripSchema},
    {name: User.name, schema:UserSchema}
  ]),
  CommonModule
],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}