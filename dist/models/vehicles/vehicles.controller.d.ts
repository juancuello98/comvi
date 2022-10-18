import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RequestHelper } from 'src/common/helpers/request.helper';
import { Request } from 'express';
export declare class VehiclesController {
    private readonly vehiclesService;
    private readonly requestHelper;
    constructor(vehiclesService: VehiclesService, requestHelper: RequestHelper);
    create(createVehicleDto: CreateVehicleDto, request: Request): Promise<import("../../common/interfaces/responses.interface").ResponseDTO>;
    findMyVehicles(request: Request): Promise<import("../../common/interfaces/responses.interface").ResponseDTO>;
    findOne(id: string): Promise<import("../../common/interfaces/responses.interface").ResponseDTO>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<import("./vehicles.schema").VehiclesDocument>;
}
