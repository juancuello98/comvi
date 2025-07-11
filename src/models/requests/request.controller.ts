import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { StatusRequest } from './enums/status.enum';
import { exNewRequest, exNewRequestResponse, exListMyRequests, exListMyRequestsEmpty } from 'src/swagger/swagger.mocks';

@ApiTags('requests')
@Controller('request')
export class RequestController {

  constructor(
    private readonly requestService: RequestService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a request to join a trip' })
  @ApiBody({
    type: NewRequestDTO,
    examples: {
      example1: {
        summary: 'Typical request to join a trip',
        description: 'Example of a request to join a trip',
        value: exNewRequest
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Request sent successfully', example: exNewRequestResponse })
  @Post('/send')
  async createRequest(@Body() tripRequest: NewRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const requestUpdated = {...tripRequest, email: userEmail };
    const resp = await this.requestService.send(requestUpdated);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a specific request' })
  @Post('/received/:requestId/accept')
  async acceptRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.acceptRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a specific request' })
  @Post('/received/:requestId/reject')
  async rejectRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.rejectRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a specific request' })
  @Delete('/submitted/:requestId')
  async cancelRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.cancelRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests that I submitted as a passenger' })
  @ApiResponse({ status: 200, description: 'Requests found successfully', example: exListMyRequests })
  @ApiResponse({ status: 404, description: 'No requests found', example: exListMyRequestsEmpty })
  @Get('/submitted')
  async findMyRequests(@Req() request: Request) : Promise<ResponseDTO>{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.findMyRequests(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests received for my published trips' })
  @Get('/received')
  async findRequestsReceived(@Req() request: Request) : Promise<ResponseDTO >{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.getRequestsForTrips(userEmail);
  }
}
