import { NewTripDTO } from './dto/new-trip.dto';
import { TripDetails } from './interface/trips-details.interface';
import { TripDocument } from './trip.schema';
import { TripService } from './trip.service';
export declare class TripController {
    private readonly tripsService;
    constructor(tripsService: TripService);
    create(trip: NewTripDTO): Promise<TripDetails | any>;
    findAll(): Promise<TripDocument[] | null>;
    findOne(id: string): Promise<TripDetails>;
}
