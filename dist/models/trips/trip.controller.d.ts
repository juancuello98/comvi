import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripDetails } from './interface/trips-details.interface';
import { TripDocument } from './trip.schema';
import { TripService } from './trip.service';
import { RequestHelper } from '../../common/helpers/request.helper';
import { Request } from 'express';
export declare class TripController {
    private readonly tripsService;
    private readonly requestHelper;
    constructor(tripsService: TripService, requestHelper: RequestHelper);
    create(trip: NewTripDTO, request: Request): Promise<ResponseDTO>;
    findAll(): Promise<TripDocument[] | null>;
    findOne(id: string): Promise<TripDetails>;
    findMyTrips(request: Request): Promise<ResponseDTO>;
}
