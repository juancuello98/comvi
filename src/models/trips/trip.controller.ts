import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';
import { RequestHelper } from '@/common/helpers/http/request.helper';
import { 
  exListMyTrips, 
  exListMyPassengerTrips, 
  exListOfPassengersNotFound, 
  exListOfPassengersFound, 
  exListOfTripsResponse, 
  exNewTrip, 
  exNewTripResponse, 
  exTripByIdResponse,
  exCancelTripResponse,
  exInitTripResponse,
  exFinishTripResponse,
  exTripNotFoundResponse,
  exUnauthorizedTripResponse
} from 'src/swagger/swagger.mocks';

@ApiTags('trips')
@Controller('trips')
export class TripController {
  constructor(
    private readonly requestHelper: RequestHelper,
    private readonly tripsService: TripService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiBody({
    type: NewTripDTO, examples: {
      example1: {
        summary: 'Typical trip creation.',
        description: 'Example of a typical trip creation.',
        value: exNewTrip
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Trip was created succesfully.', example:
    exNewTripResponse
   })
  @Post('/create')
  async create(@Request() req, @Body() trip: NewTripDTO): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req)
    return await this.tripsService.create({ ...trip, driver });
  }

  @ApiOperation({ summary: 'Get list of trips.' })
  @ApiResponse({ status: 200, description: 'Trips founded.', example:
    exListOfTripsResponse
   })
  @Get('/list')
  async findAll(@Request() req): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    return this.tripsService.findNonDriverTrips(driver);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of passengers for a specific trip.' })
  @ApiParam({ name: 'id', description: 'Trip ID', example: '1e43e5eb-9d18-486c-96f7-a36997063110' })
  @ApiResponse({ status: 200, description: 'Passengers found successfully.', example: exListOfPassengersFound })
  @ApiResponse({ status: 404, description: 'No passengers found in the trip.', example: exListOfPassengersNotFound })
  @Get('/list/passengers/:id')
  listOfPassengers(@Param('id') id: string) {
    return this.tripsService.listOfPassengers(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of my published trips.' }) 
  @ApiResponse({ status: 200, description: 'Trips founded by user.', example:
    exListMyTrips
   })
  @Get('/list/published')
  findMyTrips(@Request() req) {
    const driver = this.requestHelper.getPayload(req);
    return this.tripsService.findByDriver(driver);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of trips where I am a passenger.' }) 
  @ApiResponse({ status: 200, description: 'Trips where user is a passenger found successfully.', example: exListMyPassengerTrips })
  @Get('/list/passenger')
  findMyPassengerTrips(@Request() req) {
    const passengerEmail = this.requestHelper.getPayload(req);
    return this.tripsService.findByPassenger(passengerEmail);
  }

  @ApiOperation({ summary: 'Get trip by id.' })
  @ApiParam({ name: 'id', description: 'Trip ID', example: '1e43e5eb-9d18-486c-96f7-a36997063110' })
  @ApiResponse({ status: 200, description: 'Successfully found trips', example:
    exTripByIdResponse
   })
  @ApiResponse({ status: 404, description: 'Trip not found.', example: exTripNotFoundResponse })
  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID to cancel', example: '1e43e5eb-9d18-486c-96f7-a36997063110' })
  @ApiResponse({ status: 200, description: 'Trip cancelled successfully.', example: exCancelTripResponse })
  @ApiResponse({ status: 404, description: 'Trip not found.', example: exTripNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized.', example: exUnauthorizedTripResponse })
  @Post('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.cancel(id);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID to start', example: '1e43e5eb-9d18-486c-96f7-a36997063110' })
  @ApiResponse({ status: 200, description: 'Trip started successfully.', example: exInitTripResponse })
  @ApiResponse({ status: 404, description: 'Trip not found.', example: exTripNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the driver can start the trip.', example: exUnauthorizedTripResponse })
  @Post('/init/:id')
  async init(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.init(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finish a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID to finish', example: '1e43e5eb-9d18-486c-96f7-a36997063110' })
  @ApiResponse({ status: 200, description: 'Trip finished successfully.', example: exFinishTripResponse })
  @ApiResponse({ status: 404, description: 'Trip not found.', example: exTripNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the driver can finish the trip.', example: exUnauthorizedTripResponse })
  @Post('/finish/:id')
  async finish(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.finish(id, driver);
    return resp;
  }
}
