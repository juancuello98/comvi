import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { IBOOKING_REPOSITORY } from './repository/constants/booking.repository.constant';
import { Booking, BookingSchema } from './booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingMongodbRepository } from './repository/booking.mongodb.repository';
import { PersonModule } from '../person/person.module';
@Module({
  imports: [MongooseModule.forFeature([
    { name: Booking.name, schema: BookingSchema },
      ]),
  CommonModule,
  PersonModule
],
  controllers: [BookingController],
  providers: [BookingService, BookingMongodbRepository, {
    provide: IBOOKING_REPOSITORY,
    useClass: BookingMongodbRepository,
  }],
  exports: [BookingService, BookingMongodbRepository, IBOOKING_REPOSITORY],
})
export class BookingsModule {}
