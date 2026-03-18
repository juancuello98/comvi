import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';

@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(
    private readonly valuationsService: ValuationsService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva valoración para un usuario después de un viaje' })
  @ApiResponse({ status: 201, description: 'Valoración creada exitosamente' })
  @ApiResponse({ status: 400, description: 'El viaje no ha finalizado o datos inválidos' })
  @ApiResponse({ status: 403, description: 'No participaste en este viaje' })
  @ApiResponse({ status: 404, description: 'Viaje no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya valoraste a este usuario para este viaje' })
  @Post()
  async create(
    @Body() createValuationDto: CreateValuationDto,
    @Req() request: Request,
  ): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    return this.valuationsService.create(createValuationDto, userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis valoraciones recibidas' })
  @ApiResponse({ status: 200, description: 'Lista de valoraciones recibidas' })
  @Get('/received')
  async getMyReceivedValuations(@Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    return this.valuationsService.findByUser(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener valoraciones de un usuario específico' })
  @ApiResponse({ status: 200, description: 'Lista de valoraciones del usuario' })
  @Get('/user/:email')
  async getValuationsByUser(@Param('email') email: string): Promise<ResponseDTO> {
    return this.valuationsService.findByUser(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener valoraciones de un viaje' })
  @ApiResponse({ status: 200, description: 'Lista de valoraciones del viaje' })
  @Get('/trip/:tripId')
  async getValuationsByTrip(@Param('tripId') tripId: string): Promise<ResponseDTO> {
    return this.valuationsService.findByTrip(tripId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi resumen de rating' })
  @ApiResponse({ status: 200, description: 'Resumen de rating del usuario' })
  @Get('/rating/me')
  async getMyRatingSummary(@Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    return this.valuationsService.getUserRatingSummary(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener resumen de rating de un usuario' })
  @ApiResponse({ status: 200, description: 'Resumen de rating del usuario' })
  @Get('/rating/:email')
  async getUserRatingSummary(@Param('email') email: string): Promise<ResponseDTO> {
    return this.valuationsService.getUserRatingSummary(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar valoraciones pendientes para un viaje' })
  @ApiResponse({ status: 200, description: 'Estado de valoraciones pendientes' })
  @Get('/pending/:tripId')
  async checkPendingValuations(
    @Param('tripId') tripId: string,
    @Req() request: Request,
  ): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    return this.valuationsService.checkPendingValuations(tripId, userEmail);
  }
}
