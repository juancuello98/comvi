import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';
export declare class TripController {
    private readonly tripsService;
    constructor(tripsService: TripService);
    create(req: any, trip: NewTripDTO): Promise<ResponseDTO>;
    findAll(req: any): Promise<ResponseDTO>;
    findOne(id: string): Promise<ResponseDTO>;
    listOfPassengers(id: string): Promise<ResponseDTO>;
    findMyTrips(req: any): Promise<import("./trip.schema").TripDocument[]>;
    cancel(req: any, id: string): Promise<ResponseDTO>;
    init(req: any, id: string): Promise<ResponseDTO>;
    finish(req: any, id: string): Promise<ResponseDTO>;
}
