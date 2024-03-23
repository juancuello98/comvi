import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripsService: TripService) {}

  /**
   * @description Publish new trip.
   * @param trip with type NewTripDTO
   * @param request
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('/publish')
  async create(@Request() req, @Body() trip: NewTripDTO): Promise<ResponseDTO> {
    const email = req.user.email;
    return await this.tripsService.create({ ...trip, driver: email });
  }

  @Get('/list')
  async findAll(@Request() req): Promise<ResponseDTO> {
    const email = req.user.email;
    return this.tripsService.findNonDriverTrips(email);
  }

  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list/passengers/:id')
  listOfPassengers(@Param('id') id: string) {
    return this.tripsService.listOfPassengers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myTrips')
  findMyTrips(@Request() req) {
    const driver = req.user.email;
    return this.tripsService.findByDriver(driver);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const userEmail = req.user.email;
    const resp = await this.tripsService.cancel(id, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/init/:id')
  async init(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const userEmail = req.user.email;
    const resp = await this.tripsService.init(id, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/finish/:id')
  async finish(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const email = req.user.email;
    const resp = await this.tripsService.finish(id, email);
    return resp;
  }
}
