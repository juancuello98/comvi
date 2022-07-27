import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripDetails } from './interface/trips-details.interface';
import { TripDocument } from './trip.schema';
import { TripService } from './trip.service';


@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripsService: TripService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/publish')
  async create(@Body() trip: NewTripDTO): Promise<TripDetails | any > {
    const tripCreated = await this.tripsService.create(trip);
    return this.tripsService._getTripDetails(tripCreated);
  }

  @Get('/list')
  async findAll() : Promise<TripDocument[] | null >{
    return this.tripsService.findAll();
  }

  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }
  
}