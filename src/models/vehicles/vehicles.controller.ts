import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RequestHelper } from 'src/common/helpers/request.helper';
import { Request } from 'express';

@Controller('vehicles')
export class VehiclesController {
 
  constructor(private readonly vehiclesService: VehiclesService,
  private readonly requestHelper : RequestHelper       
  ) {}

  @Post('/create')
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() request: Request) {
    const userEmail = this.requestHelper.getPayload(request)
    return this.vehiclesService.create({...createVehicleDto, email: userEmail});
  }

  @Get('/myvehicles')
  findMyVehicles (@Req() request: Request) {
    const userEmail = this.requestHelper.getPayload(request);
    const resp = this.vehiclesService.findByUser(userEmail);
    console.log(`@Get('/myvehicles'): ${JSON.stringify(resp)}`);
    return resp;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vehiclesService.remove(+id);
  // }
}
