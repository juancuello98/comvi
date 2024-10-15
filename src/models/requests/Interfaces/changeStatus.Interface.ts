import { RequestDocument, Request } from "../request.schema";
import { UserDocument } from "@/users/user.schema";
import { TripDocument } from "@/trips/trip.schema";
import { ResponseDTO } from "@/common/interfaces/responses.interface";

export interface changeStatusInterface {
    driver: UserDocument;
    passenger: UserDocument,
    trip: TripDocument,	
    request: RequestDocument
    response: ResponseDTO
  }