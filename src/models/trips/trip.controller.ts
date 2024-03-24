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
import { RequestHelper } from '@/helpers/http/request.helper';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(
    private readonly requestHelper: RequestHelper,
    private readonly tripsService: TripService) {}

  /**
   * @description Publish new trip.
   * @param trip with type NewTripDTO
   * @param request
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('/publish')
  async create(@Request() req, @Body() trip: NewTripDTO): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req)
    return await this.tripsService.create({ ...trip, driver });
  }

  @Get('/list')
  async findAll(@Request() req): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    return this.tripsService.findNonDriverTrips(driver);
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
    const driver = this.requestHelper.getPayload(req);
    return this.tripsService.findByDriver(driver);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.cancel(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/init/:id')
  async init(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.init(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/finish/:id')
  async finish(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.finish(id, driver);
    return resp;
  }
}
