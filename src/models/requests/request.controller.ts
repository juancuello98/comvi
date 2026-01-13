import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { StatusRequest } from './enums/status.enum';
import { 
  exNewRequest, 
  exNewRequestResponse, 
  exListMyRequests, 
  exListMyRequestsEmpty,
  exAcceptRequestResponse,
  exRejectRequestResponse,
  exCancelRequestResponse,
  exRequestNotFoundResponse,
  exReceivedRequestsResponse,
  exNoReceivedRequestsResponse
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
  @ApiParam({ name: 'requestId', description: 'Request ID to accept', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request accepted successfully.', example: exAcceptRequestResponse })
  @ApiResponse({ status: 404, description: 'Request not found.', example: exRequestNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the trip driver can accept requests.' })
  @Post('/received/:requestId/accept')
  async acceptRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.acceptRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a specific request' })
  @ApiParam({ name: 'requestId', description: 'Request ID to reject', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request rejected successfully.', example: exRejectRequestResponse })
  @ApiResponse({ status: 404, description: 'Request not found.', example: exRequestNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the trip driver can reject requests.' })
  @Post('/received/:requestId/reject')
  async rejectRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.rejectRequest(requestId, userEmail);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a submitted request' })
  @ApiParam({ name: 'requestId', description: 'Request ID to cancel', example: '66e1234567890abcdef12345' })
  @ApiResponse({ status: 200, description: 'Request cancelled successfully.', example: exCancelRequestResponse })
  @ApiResponse({ status: 404, description: 'Request not found.', example: exRequestNotFoundResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Only the request owner can cancel it.' })
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
  @ApiResponse({ status: 200, description: 'Requests received for your trips.', example: exReceivedRequestsResponse })
  @ApiResponse({ status: 200, description: 'No requests received for your trips.', example: exNoReceivedRequestsResponse })
  @Get('/received')
  async findRequestsReceived(@Req() request: Request) : Promise<ResponseDTO >{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.getRequestsForTrips(userEmail);
  }
}
