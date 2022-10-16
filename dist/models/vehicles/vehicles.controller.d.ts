import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("./vehicles.schema").VehiclesDocument>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<import("./vehicles.schema").VehiclesDocument>;
}
