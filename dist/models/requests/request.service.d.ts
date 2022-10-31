import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { TripDocument } from '../trips/trip.schema';
import { UserDocument } from '../users/user.schema';
export declare class RequestService {
    private readonly requestModel;
    private readonly tripModel;
    private readonly userModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(requestModel: Model<RequestDocument>, tripModel: Model<TripDocument>, userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    findByStatus(status: string): Promise<ResponseDTO>;
    findMyRequests(email: string): Promise<ResponseDTO>;
    findById(requestId: string): Promise<ResponseDTO>;
    send(req: ExtendedRequestDTO): Promise<ResponseDTO>;
    update(request: RequestDocument): Promise<RequestDocument>;
    requestsByTrips(email: string): Promise<ResponseDTO>;
    getRequests(trip: TripDocument): Promise<any>;
}
