import { Vehicle } from 'src/models/cars/location.schema';
import { Location } from '../../locations/location.schema';
import { ExistingtTripDTO } from './existing-trip.dto';
declare const NewTripDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ExistingtTripDTO>>;
export declare class NewTripDTO extends NewTripDTO_base {
    email: string;
    origin: Location;
    destination: Location;
    allowPackage: boolean;
    allowPassenger: boolean;
    peopleQuantity: number;
    vehicle: Vehicle;
    startedTimestamp: string;
}
export {};
