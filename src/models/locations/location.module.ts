import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { UserModule } from '@/users/user.module';
import { Location, LocationSchema } from './location-schema';
import { LocationService } from './location.service';
import { LocationMongoDBRepository } from './repository/location.mongodb.repository';
import { ILOCATION_REPOSITORY } from './repository/constants/location.repository.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    CommonModule,
    UserModule
  ],
  providers: [LocationService, {
    provide: ILOCATION_REPOSITORY,
    useClass: LocationMongoDBRepository,
  }],
  exports: [LocationService],
})
export class LocationModule {}