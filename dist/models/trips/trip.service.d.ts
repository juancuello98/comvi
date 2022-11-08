import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { Trip, TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { TripResumeDocument } from '../trips-resume/trips-resume.schema';
import { UserDocument } from '../users/user.schema';
export declare class TripService {
    private readonly userModel;
    private readonly tripModel;
    private readonly tripResumeModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, tripModel: Model<TripDocument>, tripResumeModel: Model<TripResumeDocument>, responseHelper: ResponseHelper);
    findTripsByDriver(driverEmail: string): Promise<ResponseDTO>;
    findByDriver(driverEmail: string): Promise<TripDocument[]>;
    findByStatus(status: string): Promise<TripDocument[]>;
    findAll(email: string): Promise<ResponseDTO>;
    findById(tripId: string): Promise<ResponseDTO>;
    create(trip: NewTripDTO): Promise<ResponseDTO>;
    update(trip: TripDocument): Promise<TripDocument>;
    cancel(id: string, userEmail: string): Promise<ResponseDTO>;
    init(id: string, userEmail: string): Promise<ResponseDTO>;
    finish(id: string, userEmail: string): Promise<ResponseDTO>;
    listOfPassengers(tripId: string): Promise<ResponseDTO>;
    userWraped(user: any): any;
    wrapperListWithPassengers(trip: Trip, passengers: any): {};
}
