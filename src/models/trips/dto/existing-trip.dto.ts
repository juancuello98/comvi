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
  destination: string;
  origin: string;
  packages: string[];
  passengers: string[];
  peopleQuantity: number;
  placesAvailable: number;
  startedTimestamp: string;
  status: TripStatus;
  tripsRequests: string[];
  valuations: string[];
  vehicle: string;
  driver: string;
}
