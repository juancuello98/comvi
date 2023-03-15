import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';


@ApiTags('trips')
@Controller('trips')
export class TripController {

  constructor(
    private readonly tripsService: TripService,
    private readonly requestHelper: RequestHelper
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/publish')
  async create(@Body() trip: NewTripDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const tripModify = {...trip, email: userEmail }
    const resp = await this.tripsService.create(tripModify);
    return resp;
  }

  @Get('/list')
  async findAll(@Req() request: Request) : Promise<ResponseDTO >{
    const userEmail = this.requestHelper.getPayload(request)
    return this.tripsService.findAll(userEmail);
  }

  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Get('/list/passengers/:id')
  listOfPassengers(@Param('id') id: string) {
    return this.tripsService.listOfPassengers(id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('myTrips')
  findMyTrips(@Req() request: Request) {
    const userEmail = this.requestHelper.getPayload(request)
    return this.tripsService.findTripsByDriver(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:id')
  async cancel(@Req() request: Request, @Param('id') id: string): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const resp = await this.tripsService.cancel(id,userEmail);
    return resp;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('/init/:id')
  async init(@Req() request: Request, @Param('id') id: string): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const resp = await this.tripsService.init(id,userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/finish/:id')
  async finish(@Req() request: Request, @Param('id') id: string): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const resp = await this.tripsService.finish(id,userEmail);
    return resp;
  }
}