import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Model } from 'mongoose';
import { VehiclesDocument } from './vehicles.schema';
import { UserService } from '../users/user.service';
export declare class VehiclesService {
    private readonly vehiclesModel;
    private userService;
    private readonly logger;
    constructor(vehiclesModel: Model<VehiclesDocument>, userService: UserService);
    create(createVehicleDto: CreateVehicleDto): Promise<VehiclesDocument>;
    update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<VehiclesDocument>;
}
