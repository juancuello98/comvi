/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document } from 'mongoose';
import { TripStatus } from './enums/state.enum';
export type TripDocument = Trip & Document;
export declare class Trip {
    origin: unknown;
    destination: unknown;
    description: string;
    allowPackage: boolean;
    allowPassenger: boolean;
    peopleQuantity: number;
    placesAvailable: number;
    vehicleId: string;
    driver: string;
    startedTimestamp: string;
    status: TripStatus;
    passengers: string[];
    paquetes: string[];
    estimatedCosts: number;
    kilometers: number;
    createdTimestamp: string;
    tripsRequests: string[];
    valuations: string[];
    tripResumeId: string;
}
export declare const TripSchema: import("mongoose").Schema<Trip, import("mongoose").Model<Trip, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Trip>;
