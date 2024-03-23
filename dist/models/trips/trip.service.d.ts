import { UserService } from '@/users/user.service';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { TripDocument } from './trip.schema';
import { TripRepository } from './trip.repository';
import { TripResumeRepository } from './resumes/trip.resume.repository';
import { NewTripDTO } from './dto/new-trip.dto';
export declare class TripService {
    private readonly tripRepository;
    private readonly tripResumeRepository;
    readonly userService: UserService;
    readonly responseHelper: ResponseHelper;
    private readonly logger;
    constructor(tripRepository: TripRepository, tripResumeRepository: TripResumeRepository, userService: UserService, responseHelper: ResponseHelper);
    findByDriver(driver: string): Promise<TripDocument[]>;
    findByStatus(status: string): Promise<TripDocument[]>;
    findNonDriverTrips(email: string): Promise<ResponseDTO>;
    findById(tripId: string): Promise<ResponseDTO>;
    create(trip: NewTripDTO): Promise<ResponseDTO>;
    update(trip: TripDocument): Promise<TripDocument>;
    cancel(id: string, driver: string): Promise<ResponseDTO>;
    init(id: string, driver: string): Promise<ResponseDTO>;
    finish(id: string, userEmail: string): Promise<ResponseDTO>;
    listOfPassengers(tripId: string): Promise<ResponseDTO>;
}
