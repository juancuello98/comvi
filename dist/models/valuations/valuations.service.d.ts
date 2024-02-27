import { Model } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ResponseDTO } from '../../common/interfaces/responses.interface';
import { TripDocument } from '../trips/trip.schema';
import { UserDocument } from '../users/user.schema';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { ValuationDocument } from './entities/valuation.schema';
export declare class ValuationsService {
    private readonly valuationModel;
    private readonly tripModel;
    private readonly userModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(valuationModel: Model<ValuationDocument>, tripModel: Model<TripDocument>, userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    create(createValuationDto: CreateValuationDto): Promise<ResponseDTO>;
    findAll(email: string): Promise<ResponseDTO>;
    findOne(id: string): Promise<ResponseDTO>;
    update(updateValuationDto: UpdateValuationDto): Promise<ResponseDTO>;
    remove(id: string): Promise<ResponseDTO>;
}
