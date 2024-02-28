import { Module } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { ValuationsController } from './valuations.controller';
import { User, UserSchema } from '../users/user.schema';
import { Trip, TripSchema } from '../trips/trip.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema } from '../requests/request.schema';
import { CommonModule } from 'src/common/common.module';
import { TransactionModule } from '../transactions/transactions.module';
import { Valuation, ValuationSchema } from './entities/valuation.schema';


@Module({
  imports: [MongooseModule.forFeature([
    {name: Request.name, schema: RequestSchema },
    {name: Trip.name, schema: TripSchema},
    {name: User.name, schema: UserSchema},
    {name:Valuation.name, schema: ValuationSchema}
  ]),
  CommonModule,
  TransactionModule
],
  controllers: [ValuationsController],
  providers: [ValuationsService],
  exports: [ValuationsService],

})
export class ValuationsModule {}
