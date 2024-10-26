import { CreateVehicleDto } from "../dto/create-vehicle.dto"
import { UpdateVehicleDto } from "../dto/update-vehicle.dto"
import { Vehicle, VehicleDocument } from "../vehicles.schema"

export interface IVehicleRepository {
  create(createVehicleDto: CreateVehicleDto, email: string): Promise<VehicleDocument> 
  update(patent: string, updateVehicleDto: UpdateVehicleDto): Promise<VehicleDocument> 
  findByPatent(patent: string): Promise<VehicleDocument> 
  findByUser(email: string): Promise<VehicleDocument[]> 
  findByUser(email: string): Promise<VehicleDocument[]> 
  delete(patent: string): Promise<void>;
  getDocument(vehicle: VehicleDocument): Vehicle;
  }
