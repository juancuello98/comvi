import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('valuations')
@Controller('valuations')
export class ValuationsController {
  constructor(
    private readonly valuationsService: ValuationsService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @Post()
  async create(@Body() createValuationDto: CreateValuationDto) {
    const userEmail = this.requestHelper.getPayload(request);
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
