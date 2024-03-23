export declare class ExistingtTripDTO {
    id: string;
}
export declare class TripDTO {
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
