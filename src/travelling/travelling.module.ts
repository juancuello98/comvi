import { Module } from '@nestjs/common';
import { TravellingService } from './travelling.service';
import { TravellingController } from './travelling.controller';
import { FuelsModule } from 'src/models/fuels/fuels.module';
import { GoogleMapModule } from 'src/google-map-module/google-map.module';
import { ITRIP_ROUTE_REPOSITORY } from './repository/constants/tripRoute.repository.constant';
import { TripRouteRepository } from './repository/tripRoute.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TripRoute, TripRouteSchema } from './tripRoute.schema';

@Module({
  imports: [FuelsModule, GoogleMapModule,
    MongooseModule.forFeature([
      {name: TripRoute.name, schema:TripRouteSchema},
  ])],
  controllers: [TravellingController],
  providers: [TravellingService,
    {
      provide: ITRIP_ROUTE_REPOSITORY,
      useClass: TripRouteRepository,
    }
  ],
  exports: [TravellingService]
})
export class TravellingModule {}
