import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { TransactionService } from '../transactions/transaction.service';
import { StatusRequest } from './enums/status.enum';


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

  @UseGuards(JwtAuthGuard)
  @Post('/myrequests')
  async AcceptRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.ACCEPTED;
    const resp = await this.requestService.responseRequest(action, userEmail);
    if(!resp.hasError) this.transaction.processSendRequest(resp.data,userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myrequests')
  async RejectRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.REJECTED;
    const resp = await this.requestService.responseRequest(action, userEmail);
    if(!resp.hasError) this.transaction.processSendRequest(resp.data,userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myrequests')
  async CancelRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.CANCELLED;
    const resp = await this.requestService.cancelRequest(action, userEmail);
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