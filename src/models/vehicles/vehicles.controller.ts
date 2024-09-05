import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/create')
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() request: Request) {
    const email = this.requestHelper.getPayload(request);
    return this.vehiclesService.create(email,createVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/myvehicles')
  findMyVehicles(@Req() request: Request) {
    const email = this.requestHelper.getPayload(request);
    const resp = this.vehiclesService.findByUser(email);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':patent')
  findOne(@Param('patent') patent: string) {
    return this.vehiclesService.findByPatent(patent);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':patent')
  update(@Param('patent') patent: string ,@Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(patent, updateVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':patent')
  remove(@Param('patent') patent: string) {
    return this.vehiclesService.delete(patent);
  }
}
