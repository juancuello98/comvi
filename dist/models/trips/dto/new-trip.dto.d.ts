import { ExistingtTripDTO } from './existing-trip.dto';
declare const NewTripDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ExistingtTripDTO>>;
export declare class NewTripDTO extends NewTripDTO_base {
    driver: string;
    origin: unknown;
    destination: unknown;
    description: string;
    allowPackage: boolean;
    allowPassenger: boolean;
    peopleQuantity: number;
    vehicle: string;
    startedTimestamp: string;
}
export {};
