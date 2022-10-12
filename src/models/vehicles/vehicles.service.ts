import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Model } from 'mongoose';
import { Vehicles , VehiclesDocument } from './vehicles.schema'
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VehiclesService {
  
  constructor(
    @InjectModel(Vehicles.name) private readonly vehiclesModel: Model<VehiclesDocument>,
  ) {}
 async create(createVehicleDto: CreateVehicleDto):Promise<VehiclesDocument> {
    const newVehicle = new this.vehiclesModel(createVehicleDto);
    return newVehicle.save();
  }
  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<VehiclesDocument> {
    const vehicle = new this.vehiclesModel(updateVehicleDto);
    return vehicle.save(); //habría q validar q exista?
  }

  // findAll() {
  //   return `This action returns all vehicles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} vehicle`;
  // }

  // async update(id: number, updateVehicleDto: UpdateVehicleDto) {
  //   return `This action updates a #${id} vehicle`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} vehicle`;
  // }

}

