import { Model } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { TripDocument } from '../trips/trip.schema';
import { UserDocument } from '../users/user.schema';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { ValuationDocument } from './entities/valuation.schema';
export declare class ValuationsService {
    private readonly valuationModel;
    private readonly tripModel;
    private readonly userModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(valuationModel: Model<ValuationDocument>, tripModel: Model<TripDocument>, userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    create(createValuationDto: CreateValuationDto): Promise<void>;
}
