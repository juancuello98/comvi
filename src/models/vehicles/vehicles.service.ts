import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Model } from 'mongoose';
import { Vehicles , VehiclesDocument } from './vehicles.schema'
import { UserService } from '../users/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { CONNREFUSED } from 'dns';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  constructor(
    @InjectModel(Vehicles.name) private readonly vehiclesModel: Model<VehiclesDocument>
  ) {}

  async create(createVehicleDto: CreateVehicleDto):Promise<ResponseDTO> {
   try {
    const newVehicle = new this.vehiclesModel(createVehicleDto);
    const data = newVehicle.save();
    const resp = {
      hasError: false,
      message: 'Vehicle created successfully',
      data: data,
      status: HttpStatus.CREATED
    }

    return resp;
   } catch (error) {
     console.error(error);
     const resp = {
      hasError: true,
      message: 'Vehicles created failed.',
      data: error,
      status: HttpStatus.INTERNAL_SERVER_ERROR
    }

    return resp;   
   }
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<VehiclesDocument> {
    const vehicle = new this.vehiclesModel(updateVehicleDto);
    return vehicle.save(); //habría q validar q exista?
  }

  async findById(id: any) : Promise<ResponseDTO> {
    console.log(id);
    const vehicles = await this.vehiclesModel.findById(id).exec();
    return {
      hasError: false,
      message: 'User vehicles found.',
      data: vehicles,
      status: HttpStatus.OK
    }
  }

  async findByUser(email: string) : Promise<ResponseDTO> {
    console.log(email);
    const vehicles = await this.vehiclesModel.find({email}).exec();
    return {
      hasError: false,
      message: 'User vehicles found.',
      data: vehicles,
      status: HttpStatus.OK
    }
  }

  // async update(id: number, updateVehicleDto: UpdateVehicleDto) {
  //   return `This action updates a #${id} vehicle`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vehicle`;
  // }

}

