import { ClientSession } from "mongoose";
import { Valuation, ValuationDocument } from "../entities/valuation.schema";

export interface IValuationRepository {
    findAll(): Promise<ValuationDocument[]>;
    getSession(): Promise<ClientSession>;
    findValuationsByUserId(userId: string): Promise<ValuationDocument[]>;
    findValuationsByEmail(email: string): Promise<ValuationDocument[]>;
    findValuationById(valId: string): Promise<ValuationDocument>;
    findValuationBy_User_Trip(userId: string, trip: string): Promise<ValuationDocument>;
    createValuation(user: Valuation): Promise<ValuationDocument>;
    updateValuation(id: string, valuation:Valuation): Promise<ValuationDocument | null>;
    deleteValuation(id: string): Promise<ValuationDocument>;
    getAllValuation(): Promise<ValuationDocument[]>;
    getValuationFromDoc(valuation: ValuationDocument): Valuation;
}

