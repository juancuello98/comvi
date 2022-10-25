import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';


@ApiTags('request')
@Controller('request')
export class RequestController {

  constructor(
    private readonly requestService: RequestService,
    private readonly requestHelper: RequestHelper
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async create(@Body() tripRequest: NewRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const requestUpdated = {...tripRequest, email: userEmail };
    const resp = await this.requestService.create(requestUpdated);
    return resp;
  }

  // @Get('/list')
  // async findAll(@Req() request: Request) : Promise<ResponseDTO >{
  //   const userEmail = this.requestHelper.getPayload(request)
  //   return this.requestService.findAll(userEmail);
  // }

  // @Get('/list/:id')
  // findOne(@Param('id') id: string) {
  //   return this.requestService.findById(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('myRequests')
  // findMyTrips(@Req() request: Request) {
  //   const userEmail = this.requestHelper.getPayload(request)
  //   return this.requestService.findTripsByDriver(userEmail);
  // }
  
}