import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { TripDocument } from '../trips/trip.schema';
import { UserDocument } from '../users/user.schema';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
export declare class RequestService {
    private readonly requestModel;
    private readonly tripModel;
    private readonly userModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(requestModel: Model<RequestDocument>, tripModel: Model<TripDocument>, userModel: Model<UserDocument>, responseHelper: ResponseHelper);
    findByStatus(status: string): Promise<ResponseDTO>;
    findMyRequests(email: string): Promise<ResponseDTO>;
    addTripToRequest(x: RequestDocument): Promise<{
        id: any;
        email: string;
        description: string;
        hasEquipment: boolean;
        hasPartner: boolean;
        partnerQuantity: number;
        totalPassenger: number;
        createdTimestamp: string;
        status: string;
        tripId: string;
        trip: TripDocument;
        user: {
            name: string;
            lastname: string;
        };
    }>;
    findById(requestId: string): Promise<ResponseDTO>;
    acceptRequest(req: ChangeStatusOfRequestDTO, driverEmail: string): Promise<ResponseDTO>;
    rejectRequest(req: ChangeStatusOfRequestDTO, driverEmail: string): Promise<ResponseDTO>;
    cancelRequest(req: ChangeStatusOfRequestDTO, passengerEmail: string): Promise<ResponseDTO>;
    send(req: ExtendedRequestDTO): Promise<ResponseDTO>;
    update(request: RequestDocument): Promise<RequestDocument>;
    getRequestsForTrips(email: string): Promise<ResponseDTO>;
    custom_sort(a: any, b: any): number;
    getRequests(trip: TripDocument): Promise<any[]>;
    _getRequestDetails(request: RequestDocument, trip: TripDocument): Promise<{
        id: any;
        email: string;
        description: string;
        hasEquipment: boolean;
        hasPartner: boolean;
        partnerQuantity: number;
        totalPassenger: number;
        createdTimestamp: string;
        status: string;
        tripId: string;
        trip: TripDocument;
        user: {
            name: string;
            lastname: string;
        };
    }>;
}
