import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
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
  @Post('/myrequests/acceptRequest')
  async AcceptRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.ACCEPTED.toString();
    const resp = await this.requestService.acceptRequest(action, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myrequests/rejectRequest')
  async RejectRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.REJECTED.toString();
    const resp = await this.requestService.rejectRequest(action, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/myrequests/cancelRequest')
  async CancelRequest(@Body() action: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    action.newStatus = StatusRequest.CANCELLED;
    const resp = await this.requestService.cancelRequest(action, userEmail);
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