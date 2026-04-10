import { ClientSession } from "mongoose";
import { Valuation } from "../entities/valuation.schema";

export interface IValuationRepository {
    findAll(): Promise<Valuation[]>;
    findValuationsByEmail(email: string): Promise<Valuation[]>;
    findValuationById(valId: string): Promise<Valuation>;
    findValuationBy_User_Trip(userId: string, trip: string): Promise<Valuation>;
    createValuation(user: Valuation): Promise<Valuation>;
    updateValuation(id: string, valuation:Valuation): Promise<Valuation | null>;
    deleteValuation(id: string): Promise<Valuation>;
    getAllValuation(): Promise<Valuation[]>;
    getValuationFromDoc(valuation: Valuation): Valuation;
}

