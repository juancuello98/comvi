import { IsNotEmpty } from 'class-validator';
import { TripStatus } from '../enums/state.enum';

export class ExistingtTripDTO {
  @IsNotEmpty()
  id: string;
}

export class TripDTO {
  id?: string;
  allowPackage: boolean;
  allowPassenger: boolean;
  createdTimestamp: string;
  description: string;
  destination: any;
  origin: any;
  paquetes: string[];
  passengers: string[];
  peopleQuantity: number;
  placesAvailable: number;
  startedTimestamp: string;
  status: TripStatus;
  tripsRequests: string[];
  valuations: string[];
  vehicleId: string;
  driver: string;
}
