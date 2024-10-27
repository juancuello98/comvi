import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/jwt/jwt-auth.guard';
import {
  exCreateValuationRequest,
  exCreateValuationResponse,
  exFindAllValuationsResponse,
  exFindOneValuationResponse,
  exUpdateValuationRequest,
  exUpdateValuationResponse,
  exDeleteValuationResponse,
} from 'src/swagger/swagger.mocks';
import { ResponseDTO } from '@/common/interfaces/responses.interface';

@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(
    private readonly valuationsService: ValuationsService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a valuation' })
  @ApiBody({
    type: CreateValuationDto,
    examples: {
      example1: {
        summary: 'Typical create valuation request.',
        description: 'Example of a typical create valuation request.',
        value: exCreateValuationRequest,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Valuation created successfully.',
    example: exCreateValuationResponse,
  })
  async create(@Body() createValuationDto: CreateValuationDto, @Req() request: Request) {
    const userEmail = this.requestHelper.getPayload(request);
    const valuationModify = { ...createValuationDto, email: userEmail };
    return this.valuationsService.create(valuationModify);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all valuations' })
  @ApiResponse({
    status: 200,
    description: 'Successfully found valuations',
    example: exFindAllValuationsResponse,
  })
  async findAll(@Req() request: Request) {
    const userEmail = this.requestHelper.getPayload(request);
    return this.valuationsService.findAll(userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a valuation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Valuation Successfully founded',
    example: exFindOneValuationResponse,
  })
  async findOne(@Param('id') id: string): Promise<ResponseDTO> {
    return this.valuationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a valuation' })
  @ApiBody({
    type: UpdateValuationDto,
    examples: {
      example1: {
        summary: 'Typical update valuation request.',
        description: 'Example of a typical update valuation request.',
        value: exUpdateValuationRequest,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The valuation of the trip was updated',
    example: exUpdateValuationResponse,
  })
  async update(@Param('id') id: string, @Body() updateValuationDto: UpdateValuationDto, @Req() request: Request): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    const valuationModify = { ...updateValuationDto, email: userEmail };
    return this.valuationsService.update(valuationModify);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a valuation' })
  @ApiResponse({
    status: 200,
    description: 'The valuation of the trip was deleted',
    example: exDeleteValuationResponse,
  })
  async remove(@Param('id') id: string): Promise<ResponseDTO> {
    return this.valuationsService.remove(id);
  }
}