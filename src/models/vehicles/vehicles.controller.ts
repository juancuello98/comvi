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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { exDeleteVehicleResponse, exFindVehicleByPatent, exMyVehiclesResponse, exNewVehicle, exNewVehicleResponse, exUpdateVehicle, exUpdateVehicleResponse } from 'src/swagger/swagger.mocks';


@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiBody({
    type: CreateVehicleDto, examples: {
      example1: {
        summary: 'Typical vehicle creation.',
        description: 'Example of a typical vehicle creation.',
        value: exNewVehicle
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully.', example:
    exNewVehicleResponse
   })
  @Post('/create')
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() request: Request) {
    const email = this.requestHelper.getPayload(request);
    return this.vehiclesService.create(email,createVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my vehicles.' })
  @ApiResponse({ status: 200, description: 'List my vehicles successfully.', example:
    exMyVehiclesResponse
   })
  @Get('/myvehicles')
  findMyVehicles(@Req() request: Request) {
    const email = this.requestHelper.getPayload(request);
    const resp = this.vehiclesService.findByUser(email);
    return resp;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find vehicle by patent plate.' })
  @ApiResponse({ status: 200, description: 'Vehicle founded successfully.', example:
    exFindVehicleByPatent
   })
  @Get(':patent')
  findOne(@Param('patent') patent: string) {
    return this.vehiclesService.findByPatent(patent);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vehicle by patent plate.' })
  @ApiBody({
    type: CreateVehicleDto, examples: {
      example1: {
        summary: 'Typical vehicle update.',
        description: 'Example of a typical vehicle update.',
        value: exUpdateVehicle
      }
    }
  }) 
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully.', example:
    exUpdateVehicleResponse
   })
  @Patch(':patent')
  update(@Param('patent') patent: string ,@Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(patent, updateVehicleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vehicle by patent plate.' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully.', example:
    exDeleteVehicleResponse
  })
  @Delete(':patent')
  remove(@Param('patent') patent: string) {
    return this.vehiclesService.delete(patent);
  }
}
