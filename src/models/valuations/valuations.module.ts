import { Module } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { ValuationsController } from './valuations.controller';
import { User, UserSchema } from '../users/user.schema';
import { Trip, TripSchema } from '../trips/trip.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { RequestSchema } from '../requests/request.schema';
import { CommonModule } from 'src/common/common.module';
import { Valuation, ValuationSchema } from './entities/valuation.schema';
import { IVALUATION_REPOSITORY } from './repository/constants/valuations.repository.constant';
import { ValuationsMongodbRepository } from './repository/valuations.mongodb.repository';
import { TripModule, TripResume, TripResumeSchema } from '../trips';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: Request.name, schema: RequestSchema },
      { name: Trip.name, schema: TripSchema },
      { name: User.name, schema: UserSchema },
      { name: TripResume.name, schema: TripResumeSchema },
      { name: Valuation.name, schema: ValuationSchema },
    ]),
    TripModule,
    UserModule,
    CommonModule,
  ],
  controllers: [ValuationsController],
  providers: [ValuationsService, ValuationsMongodbRepository,
    {
      provide: IVALUATION_REPOSITORY,
      useClass: ValuationsMongodbRepository,
    }
   ],
  exports: [ValuationsService, IVALUATION_REPOSITORY, ValuationsMongodbRepository ],
})
export class ValuationsModule {}
