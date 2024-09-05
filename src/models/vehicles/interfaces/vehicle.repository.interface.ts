import { CreateVehicleDto } from "../dto/create-vehicle.dto"
import { UpdateVehicleDto } from "../dto/update-vehicle.dto"
import { Vehicle } from "../vehicles.schema"

export interface IVehicleRepository {
  create(createVehicleDto: CreateVehicleDto, email: string): Promise<Vehicle> 
  update(patent: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> 
  findByPatent(patent: string): Promise<Vehicle> 
  findByUser(email: string): Promise<Vehicle[]> 
  findByUser(email: string): Promise<Vehicle[]> 
  delete(patent: string): Promise<void>;
  }
