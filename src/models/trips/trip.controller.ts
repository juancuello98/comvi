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
import { exListMyTrips, exListOfPassengersNotFound, exListOfTripsResponse, exNewTrip, exNewTripResponse, exTripByIdResponse } from 'src/swagger/swagger.mocks';

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
  @Post('/publish')
  async create(@Request() req, @Body() trip: NewTripDTO): Promise<ResponseDTO> {
    const driver = this.requestHelper.getPayload(req)
    trip.driver = driver;
    return await this.tripsService.create({ ...trip });
  }

  @ApiOperation({ summary: 'Get list of trips.' })
  @ApiResponse({ status: 200, description: 'Trips founded.', example:
    exListOfTripsResponse
   })
  @Get('/list')
  async findAll(@Request() req): Promise<ResponseDTO> {
    return this.tripsService.findAll();
  }

  @ApiOperation({ summary: 'Get trip by id.' })
  @ApiResponse({ status: 200, description: 'Successfully found trips', example:
    exTripByIdResponse
   })
  @Get('/list/:id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of passengers.' }) //TODO: Terminar esto
   @ApiResponse({ status: 200, description: 'Not found passengers in the trip.', example:
    exListOfPassengersNotFound
   })
  @Get('/list/passengers/:id')
  listOfPassengers(@Param('id') id: string) {
    return this.tripsService.listOfPassengers(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of my trips.' }) 
  @ApiResponse({ status: 200, description: 'Trips founded by user.', example:
    exListMyTrips
   })
  @Get('/mytrips')
  findMyTrips(@Request() req) {
    const driver = this.requestHelper.getPayload(req);
    return this.tripsService.findByDriver(driver);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/cancel/:id')
  async cancel(@Request() req, @Param('id') id: string): Promise<ResponseDTO> {
    // const driver = this.requestHelper.getPayload(req);
    const resp = await this.tripsService.cancel(id);
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
}
