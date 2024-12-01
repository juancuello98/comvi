import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';

@ApiTags('requests')
@Controller('requests')
export class BookingController {

  constructor(
    private readonly bookingService: BookingService,
    private readonly requestHelper: RequestHelper,
  ) {}

  
  // @UseGuards(JwtAuthGuard)
  // @Get('/findAll') 
  // @ApiOperation({ summary: 'Get all bookings' })
  // @ApiResponse({ status: 201, description: 'Booking sended successfully.', example:})
  // async createBooking(@Body() tripBooking: NewBookingDTO, @Req() request: Booking): Promise<ResponseDTO> {
  //   const userEmail = this.requestHelper.getPayload(request);
  //   const requestUpdated = {...tripBooking, email: userEmail };
  //   const resp = await this.bookingService.send(requestUpdated);
  //   return resp;
  // }

  

}