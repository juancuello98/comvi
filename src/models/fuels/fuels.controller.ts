import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuelService } from './fuels.service';
// import { CreateFuelDto } from './dto/create-fuel.dto';
// import { UpdateFuelDto } from './dto/update-fuel.dto';
import { get } from 'axios';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('fuels')
export class FuelsController {
  constructor(private readonly fuelsService: FuelService) {}


  @Get() 
  @ApiOperation({ summary: 'Update fuels prices' })
  // @ApiBearerAuth()
  async UpdatePrices() {
    return this.fuelsService.downloadAndSaveCSV();
  }

  @Get()
  @ApiOperation({ summary: 'Update fuels prices' })
  async GetFuelsPrices () {
    return this.fuelsService.getFuelsPrices();
  }
  
  @Get()
  @ApiOperation({ summary: 'Update fuels prices' })
  async ActulizarCombustibles() {
    return this.fuelsService.downloadAndSaveCSV();
  }
  

}
