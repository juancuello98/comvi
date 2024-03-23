import { IsNotEmpty } from 'class-validator';

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
  destination: unknown;
  origin: unknown;
  paquetes: string[];
  passengers: string[];
  peopleQuantity: number;
  placesAvailable: number;
  startedTimestamp: string;
  status: string;
  tripsRequests: string[];
  valuations: string[];
  vehicleId: string;
  driver: string;
}
