import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';
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
    updateUserRequests(email: string, id: any): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateTripRequests(tripId: string, requestId: string): Promise<Trip & TripDocument>;
}
