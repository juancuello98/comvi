import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Model } from 'mongoose';
import { VehiclesDocument } from './vehicles.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
export declare class VehiclesService {
    private readonly vehiclesModel;
    private readonly logger;
    constructor(vehiclesModel: Model<VehiclesDocument>);
    create(createVehicleDto: CreateVehicleDto): Promise<ResponseDTO>;
    update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<VehiclesDocument>;
    findById(id: any): Promise<ResponseDTO>;
    findByUser(email: string): Promise<ResponseDTO>;
}
