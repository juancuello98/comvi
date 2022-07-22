export declare class User {
    username: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    verificationCode: number;
    validated: string;
    trips: Trip[];
    locations: Location[];
    packages: Package[];
    tripsFavourites: Trip[];
    subscribedTrips: Trip[];
    tripsCreated: Trip[];
    solicitudes: Solicitud[];
}
export declare class Trip {
}
export declare class Location {
}
export declare class Package {
}
export declare class Solicitud {
}
