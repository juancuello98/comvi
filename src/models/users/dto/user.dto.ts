import { Package } from 'src/models/packages/package.schema';
import { Trip } from 'src/models/trips/trip.schema';

export class GetUserDTO {
  lastname: string;

  name: string;

  email: string;

  trips: any[];

  packages: any[];

  tripsFavourites: any[];

  subscribedTrips: any[];

  tripsCreated: any[];

  joinRequests: any[];
}
