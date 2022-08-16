import { Model } from 'mongoose';
import { TripDetails } from '../trips/interface/trips-details.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { UserService } from '../users/user.service';
import { TripDocument } from './trip.schema';
export declare class TripService {
    private readonly tripModel;
    private readonly userService;
    private readonly logger;
    constructor(tripModel: Model<TripDocument>, userService: UserService);
    _getTripDetails(trip: TripDocument): TripDetails;
    findTripsByDriver(driverId: string): Promise<TripDocument[]>;
    findByStatus(status: string): Promise<TripDocument[]>;
    findAll(): Promise<TripDocument[] | null>;
    findById(tripId: string): Promise<TripDetails | null>;
    create(trip: NewTripDTO): Promise<TripDocument>;
    update(trip: TripDocument): Promise<TripDocument>;
}
