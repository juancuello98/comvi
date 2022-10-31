import { Model } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';
export declare class TransactionService {
    private readonly tripModel;
    private readonly userModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(tripModel: Model<TripDocument>, userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    processSendRequest(request: any, userEmail: string): Promise<void>;
    updateUserRequests(email: string, id: any): Promise<User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateTripRequests(tripId: string, requestId: string): Promise<Trip & TripDocument>;
}
