import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { StatusRequest } from './enums/status.enum';
import { exCreateRequestResponse, exSendRequest } from 'src/swagger/swagger.mocks';

@ApiTags('requests')
@Controller('requests')
export class RequestController {

  constructor(
    private readonly requestService: RequestService,
    private readonly requestHelper: RequestHelper,
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @Post('/send') 
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a request' })
  @ApiBody({
    type: NewRequestDTO, examples: {
      example1: {
        summary: 'Typical send reuqest.',
        description: 'Example of a typical send reuqest.',
        value: exSendRequest
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Requested sended successfully.', example:exCreateRequestResponse})
  async createRequest(@Body() tripRequest: NewRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
   
    const userEmail = this.requestHelper.getPayload(request);
    const requestUpdated = {...tripRequest, email: userEmail };
    const resp = await this.requestService.send(requestUpdated);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Acept a request' })
  @ApiBody({
    type: NewRequestDTO, examples: {
      example1: {
        summary: 'Typical acept reuqest.',
        description: 'Example of a typical acept reuqest.',
        value: exSendRequest
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Requested sended successfully.', example:exCreateRequestResponse})
  @UseGuards(JwtAuthGuard)
  @Post('/myrequests/:requestId/accept') 
  async acceptRequest(@Param('request') requestDTO: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.acceptRequest(requestDTO, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Acept a request' })
  @ApiBody({
    type: NewRequestDTO, examples: {
      example1: {
        summary: 'Typical acept reuqest.',
        description: 'Example of a typical acept reuqest.',
        value: exSendRequest
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Requested rejected successfully.', example:exCreateRequestResponse})
  @UseGuards(JwtAuthGuard)
  @Post('/myrequests/:requestId/reject') // Rechazar solicitud específica del usuario
  async rejectRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.rejectRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/myrequests/:requestId') // Cancelar solicitud específica del usuario
  async cancelRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.cancelRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myrequests') // Obtener todas las solicitudes del usuario
  async findMyRequests(@Req() request: Request) : Promise<ResponseDTO>{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.findMyRequests(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/requestsBytrips') // Obtener solicitudes por viajes del usuario
  async findRequestsByTrips(@Req() request: Request) : Promise<ResponseDTO >{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.getRequestsForTrips(userEmail);
  }
}
