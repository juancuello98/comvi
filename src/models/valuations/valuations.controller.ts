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
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { exNewValuation, exNewValuationResponse } from 'src/swagger/swagger.mocks';


@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(
    private readonly valuationsService: ValuationsService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new valuation for a trip or user' })
  @ApiBody({
    type: CreateValuationDto,
    examples: {
      example1: {
        summary: 'Typical valuation creation',
        description: 'Example of creating a valuation for a trip driver',
        value: exNewValuation
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Valuation created successfully.', example: exNewValuationResponse })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid valuation data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  async create(@Body() createValuationDto: CreateValuationDto, @Req() req: Request) {
    const userEmail = this.requestHelper.getPayload(req);
    const valuationModify = { ...createValuationDto }; //, email: userEmail }
    await this.valuationsService.create(valuationModify);
  }

  // @Get()
  // findAll() {
  //   const userEmail = this.requestHelper.getPayload(request)
  //   return this.valuationsService.findAll(userEmail);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<ResponseDTO> {
  //   return this.valuationsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Body() updateValuationDto: UpdateValuationDto): Promise<ResponseDTO> {
  //   const userEmail = this.requestHelper.getPayload(request)
  //   const valuationModify = {...updateValuationDto, email: userEmail }
  //   return this.valuationsService.update(valuationModify);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<ResponseDTO> {
  //   return this.valuationsService.remove(id);
  // }
}
