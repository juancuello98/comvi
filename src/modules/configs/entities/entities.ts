export class User {
  username: string;
  name: string;
  email: string;
  password: string;
  trips: Trip[];
  locations: Location[];
  packages: Package[]
  tripsFavourites:Trip[]
  subscribedTrips:Trip[]
  tripsCreated:Trip[]
  solicitudes: Solicitud []
}

export class Trip {

}

export class Location {

}

export class Package {

}

export class Solicitud {

}