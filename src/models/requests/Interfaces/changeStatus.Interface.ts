import { RequestDocument, Request } from "../request.schema";
import { UserDocument } from "@/users/user.schema";
import { TripDocument } from "@/trips/trip.schema";
import { ResponseDTO } from "@/common/interfaces/responses.interface";

export interface changeStatusInterface {
    actioner: UserDocument|any;
    passenger: UserDocument|any,
    trip: TripDocument|any,	
    request: RequestDocument|any,
    response: ResponseDTO|any
  }