import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import {
  exSendRequest,
  exCreateRequestResponse,
  exRequestFindedResponse,
  exRequestsdFindedResponse,
  exAcceptRequestResponse,
  exRejectRequestResponse,
  exCancelRequestResponse,
} from 'src/swagger/swagger.mocks';

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
        value: exSendRequest
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Request sent successfully', example: exCreateRequestResponse })
  @Post('/send')
  async createRequest(@Body() tripRequest: NewRequestDTO, @Req() request: ExpressRequest): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const requestUpdated = {...tripRequest, email: userEmail };
    const resp = await this.requestService.send(requestUpdated);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a specific request' })
  @ApiParam({ name: 'requestId', description: 'Request ID to accept', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request accepted successfully.', example: exAcceptRequestResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the trip driver can accept requests.' })
  @Post('/received/:requestId/accept')
  async acceptRequest(@Param('requestId') requestId: string, @Req() request: ExpressRequest): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const dto = { requestId } as ChangeStatusOfRequestDTO;
    const resp = await this.requestService.acceptRequest(dto, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a specific request' })
  @ApiParam({ name: 'requestId', description: 'Request ID to reject', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request rejected successfully.', example: exRejectRequestResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the trip driver can reject requests.' })
  @Post('/received/:requestId/reject')
  async rejectRequest(@Param('requestId') requestId: string, @Req() request: ExpressRequest): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const dto = { requestId } as ChangeStatusOfRequestDTO;
    const resp = await this.requestService.rejectRequest(dto, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a submitted request' })
  @ApiParam({ name: 'requestId', description: 'Request ID to cancel', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request cancelled successfully.', example: exCancelRequestResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the request owner can cancel it.' })
  @Delete('/submitted/:requestId')
  async cancelRequest(@Param('requestId') requestId: string, @Req() request: ExpressRequest): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const dto = { requestId } as ChangeStatusOfRequestDTO;
    const resp = await this.requestService.cancelRequest(dto, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests that I submitted as a passenger' })
  @ApiResponse({ status: 200, description: 'Requests found successfully', example: exRequestFindedResponse })
  @Get('/submitted')
  async findMyRequests(@Req() request: ExpressRequest, @Res() res: Response) : Promise<void>{
    const userEmail = this.requestHelper.getPayload(request);
    const result = await this.requestService.findMyRequests(userEmail);
    res.status(result.status ?? HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests received for my published trips' })
  @ApiResponse({ status: 200, description: 'Requests received for your trips.', example: exRequestsdFindedResponse })
  @Get('/received')
  async findRequestsReceived(@Req() request: ExpressRequest, @Res() res: Response) : Promise<void>{
    const userEmail = this.requestHelper.getPayload(request);
    const result = await this.requestService.getRequestsByTrips(userEmail);
    res.status(result.status ?? HttpStatus.OK).json(result);
  }
}
