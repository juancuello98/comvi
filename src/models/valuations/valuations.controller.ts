import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';


@Controller('valuations')
export class ValuationsController {
  constructor(private readonly valuationsService: ValuationsService,  private readonly requestHelper: RequestHelper) {}

  @Post()
  async create(@Body() createValuationDto: CreateValuationDto) : Promise<ResponseDTO> {
    
    const userEmail = this.requestHelper.getPayload(request)
    const valuationModify = {...createValuationDto, email: userEmail }
    const resp = await this.valuationsService.create(valuationModify);
    return resp;
  }
  

  @Get()
  findAll() {
    const userEmail = this.requestHelper.getPayload(request)
    return this.valuationsService.findAll(userEmail);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseDTO> {
    return this.valuationsService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateValuationDto: UpdateValuationDto): Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request)
    const valuationModify = {...updateValuationDto, email: userEmail }
    return this.valuationsService.update(valuationModify);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ResponseDTO> {
    return this.valuationsService.remove(id);
  }
}
