import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { exAcceptRequest, exCancelRequest, exCancelRequestResponse, exCreateRequestResponse, exRejectRequest, exRejectRequestResponse, exRequestFindedResponse, exSendRequest, exRequestsdFindedResponse, exFindRequestResponse, exAcceptRequestResponse } from 'src/swagger/swagger.mocks';

@ApiTags('requests')
@Controller('requests')
export class RequestController {

  constructor(
    private readonly requestService: RequestService,
    private readonly requestHelper: RequestHelper,
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @Post('/send') 
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
  @ApiBearerAuth()
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
    type: ChangeStatusOfRequestDTO, examples: {
      example1: {
        summary: 'Typical acept request.',
        description: 'Example of a typical acept request.',
        value: exAcceptRequest
      }
    }
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Requested sended successfully.', example:exAcceptRequestResponse})
  @UseGuards(JwtAuthGuard)
  @Post('/recievedRequests/accept') 
  async acceptRequest(@Body() requestDTO: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.acceptRequest(requestDTO, userEmail);
    return resp;
  }

  
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Reject a request' })
  // @ApiBody({
  //   type: ChangeStatusOfRequestDTO, examples: {
  //     example1: {
  //       summary: 'Typical reject reuqest.',
  //       description: 'Example of a typical acept reuqest.',
  //       value: exRejectRequest
  //     }
  //   }
  // })
  // @ApiBearerAuth()
  // @ApiResponse({ status: 201, description: 'Requested rejected successfully.', example:exRejectRequestResponse})
  // @Post('/recievedRequests/reject')
  // async rejectRequest(@Body() requestDTO: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
  //   const userEmail = this.requestHelper.getPayload(request);
  //   const resp = await this.requestService.rejectRequest(requestDTO, userEmail);
  //   return resp;
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel a request' })
  @ApiBody({
    type: ChangeStatusOfRequestDTO, examples: {
      example1: {
        summary: 'Typical reject reuqest.',
        description: 'Example of a typical acept reuqest.',
        value: exRejectRequest
      }
    }
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Requested rejected successfully.', example:exRejectRequestResponse})
  @Post('/recievedRequests/reject')
  async updateRequest(@Body() requestDTO: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.rejectRequest(requestDTO, userEmail);
    return resp;
  }


 @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find a request' })
  @ApiResponse({ status: 201, description: 'Request finded successfully.', example:exFindRequestResponse})
  @Get('/myrequests/:requestId') 
  async findRequest(@Param('requestId') requestId: string, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.findRequestById(requestId, userEmail);
    return resp;
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel a request' })
  @ApiResponse({ status: 201, description: 'Request finded successfully.', example:exCancelRequestResponse})
  @ApiBody({
    type: ChangeStatusOfRequestDTO, examples: {
      example1: {
        summary: 'Typical cancel request.',
        description: 'Example of a typical cancel request.',
        value: exCancelRequest
      }
    }
  })

  @Delete('/myrequests/cancel') 
  async cancelMyRequest(@Body() requestDTO: ChangeStatusOfRequestDTO, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = await this.requestService.cancelRequest(requestDTO, userEmail);
    return resp;
  }




  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Look for my requests' })
  @ApiResponse({ status: 201, description: 'Requests finded successfully.', example:exRequestFindedResponse})  
  @Get('/myrequests') // Obtener todas las solicitudes del usuario
  async findMyRequests(@Req() request: Request) : Promise<ResponseDTO>{
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.findMyRequests(userEmail);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find the request sended to you for a all your trips.' })
  @ApiResponse({ status: 201, description: 'Requested rejected successfully.', example:exRequestsdFindedResponse})  
  @Get('/requestsWithrips') // Obtener solicitudes por viajes del usuario
  async findRequestsByTrips(@Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.getRequestsByTrips(userEmail);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  //@UseFilters()
  // @UseGuards(Rol)
  @ApiOperation({ summary: 'Find the request for a all trips.' })
  @ApiResponse({ status: 201, description: 'Requested rejected successfully.', example:exRequestsdFindedResponse})  
  @Get('/findAll') // Obtener solicitudes por viajes del usuario
  async findAllRequests(@Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    return this.requestService.findAllRequests();
}
}