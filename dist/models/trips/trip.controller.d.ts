import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { TripService } from './trip.service';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
export declare class TripController {
    private readonly tripsService;
    private readonly requestHelper;
    constructor(tripsService: TripService, requestHelper: RequestHelper);
    create(trip: NewTripDTO, request: Request): Promise<ResponseDTO>;
    findAll(request: Request): Promise<ResponseDTO>;
    findOne(id: string): Promise<ResponseDTO>;
    listOfPassengers(id: string): Promise<ResponseDTO>;
    findMyTrips(request: Request): Promise<ResponseDTO>;
    cancel(request: Request, id: string): Promise<ResponseDTO>;
    init(request: Request, id: string): Promise<ResponseDTO>;
    finish(request: Request, id: string): Promise<ResponseDTO>;
}
