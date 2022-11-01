import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { TransactionService } from '../transactions/transaction.service';


@ApiTags('request')
@Controller('request')
export class RequestController {

  constructor(
    private readonly requestService: RequestService,
    private readonly requestHelper: RequestHelper,
    private readonly transaction: TransactionService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async create(@Body() tripRequest: NewRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const requestUpdated = {...tripRequest, email: userEmail };
    const resp = await this.requestService.send(requestUpdated);
    if(!resp.hasError) this.transaction.processSendRequest(resp.data,userEmail);
    return resp;
  }

  @Get('/myrequests')
  async findMyRequests(@Req() request: Request) : Promise<ResponseDTO>{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.findMyRequests(userEmail);
  }

  @Get('/requestsBytrips')
  async requestsByTrips(@Req() request: Request) : Promise<ResponseDTO >{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.getRequestsForTrips(userEmail);
  }
  
}