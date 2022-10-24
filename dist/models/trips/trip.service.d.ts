import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { UserService } from '../users/user.service';
import { TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
export declare class TripService {
    private readonly tripModel;
    private readonly userService;
    private readonly logger;
    constructor(tripModel: Model<TripDocument>, userService: UserService);
    findTripsByDriver(driverEmail: string): Promise<ResponseDTO>;
    findByDriver(driverEmail: string): Promise<TripDocument[]>;
    findByStatus(status: string): Promise<TripDocument[]>;
    findAll(email: string): Promise<ResponseDTO>;
    findById(tripId: string): Promise<ResponseDTO>;
    create(trip: NewTripDTO): Promise<ResponseDTO>;
    update(trip: TripDocument): Promise<TripDocument>;
    makeResponse: (hasError: boolean, message: string, data: any, status: HttpStatus) => ResponseDTO;
}
