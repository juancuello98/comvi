import { ExistingtTripDTO } from './existing-trip.dto';
declare const NewTripDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ExistingtTripDTO>>;
export declare class NewTripDTO extends NewTripDTO_base {
    origin: string;
    destination: string;
    peopleCapacity: number;
    driverEmail: string;
    checkOut: string;
    checkIn: string;
    status: string;
}
export {};
