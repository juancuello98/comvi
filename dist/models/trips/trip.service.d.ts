import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
export declare class TripService {
    private readonly tripModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(tripModel: Model<TripDocument>, responseHelper: ResponseHelper);
    findTripsByDriver(driverEmail: string): Promise<ResponseDTO>;
    findByDriver(driverEmail: string): Promise<TripDocument[]>;
    findByStatus(status: string): Promise<TripDocument[]>;
    findAll(email: string): Promise<ResponseDTO>;
    findById(tripId: string): Promise<ResponseDTO>;
    create(trip: NewTripDTO): Promise<ResponseDTO>;
    update(trip: TripDocument): Promise<TripDocument>;
}
