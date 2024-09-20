import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { IVehicleRepository } from './interfaces/vehicle.repository.interface';
import { IVEHICLE_REPOSITORY } from './repository/constants/vehicle.repository.constant';
import { MongoDuplicateKeyError } from '@/common/error/mongodb.errors';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  constructor(
    @Inject(IVEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async create(email:string, createVehicleDto: CreateVehicleDto): Promise<ResponseDTO> {
    try {
      const newVehicle = await this.vehicleRepository.create(createVehicleDto, email);
      const resp = {
        hasError: false,
        message: 'Vehicle created successfully.',
        data: newVehicle,
       status: HttpStatus.CREATED,
      };

      return resp;
    } catch (error) {
      const resp = {
        hasError: true,
        message: 'Create vehicle was failed.',
        data: error instanceof MongoDuplicateKeyError ? error.message : null,
       status: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      return resp;
    }
  }

  async update(
    patent: any,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<ResponseDTO> {
    const vehicle = await this.vehicleRepository.update(patent,updateVehicleDto);
    return {
      hasError: false,
      message: 'Vehicle updated.',
      data: vehicle,
     status: HttpStatus.OK,
    };
  }

  async findByPatent(patent: any): Promise<ResponseDTO> {
    try {
      const vehicle = await this.vehicleRepository.findByPatent(patent)
    return {
      hasError: false,
      message: vehicle ? 'Vehicle founded.' : 'Vehicle not founded.',
      data: vehicle,
     status: HttpStatus.OK,
    };
    } catch (error) {
      return {
        hasError: true,
        message: 'Find vehicle was failed.',
        data: error instanceof MongoDuplicateKeyError ? error.message : null,
       status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByUser(email: string): Promise<ResponseDTO> {
    const vehicles = await this.vehicleRepository.findByUser(email);
    return {
      hasError: false,
      message: 'User vehicles found.',
      data: vehicles,
     status: HttpStatus.OK,
    };
  }

  async delete(patent: any): Promise<ResponseDTO> {
    const vehicle = await this.vehicleRepository.delete(patent)
    return {
      hasError: false,
      message: 'Vehicle deleted.',
      data: vehicle,
     status: HttpStatus.OK,
    };
  }
}
