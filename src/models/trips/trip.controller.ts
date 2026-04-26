import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';
import { RequestHelper } from '@/common/helpers/http/request.helper';
import { exListMyTrips, exListOfPassengersFound, exListOfPassengersNotFound, exListOfTripsResponse, exListMyPassengerTrips, exNewTrip, exNewTripResponse, exTripByIdResponse } from 'src/swagger/swagger.mocks';
import { ExistingtTripDTO } from './dto/existing-trip.dto';

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
    trip.driver = driver;
    return await this.tripsService.createToController({ ...trip });
  }

  @ApiOperation({ summary: 'Get list of trips.' })
  @ApiResponse({ status: 200, description: 'Trips founded.', example:
    exListOfTripsResponse
   })
  @Get('/list')
  async findAll(@Request() req): Promise<ResponseDTO> {
    return this.tripsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of passengers for a specific trip.' })
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
    return this.tripsService.findByDriverController(driver);
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
  @ApiResponse({ status: 200, description: 'Successfully found trips', example:
    exTripByIdResponse
   })
  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findByIdWithPassengers(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a trip and notify passengers.' })
  @Post('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.cancel(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/init/:id')
  async init(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.init(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/finish/:id')
  async finish(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.finish(id, driver);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('getTripCOST/:id')
  async getTripCost(@Param('id') id: string): Promise<any> {
    console.log('TripId: ', id);
    const resp = await this.tripsService.getTripCost(id);
    return resp;
  }
}
