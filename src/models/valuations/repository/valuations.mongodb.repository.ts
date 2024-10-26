
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ValuationDocument, Valuation } from '../entities/valuation.schema';
import { IValuationRepository } from '../interfaces/valuations.repository.interface';

export class ValuationsMongodbRepository implements IValuationRepository {

  constructor(
    @InjectModel(Valuation.name) private readonly valuationModel: Model<ValuationDocument>,
  ) {}
  getValuationFromDoc(valuation: ValuationDocument): Valuation {
    const { _id, email, userId, tripId, puntaje, detalle, } = valuation;
    const val = new Valuation();
    val.id = _id;
    val.email = email;
    val.userId = userId;
    val.tripId = tripId;
    val.puntaje = puntaje;
    val.detalle = detalle;
    return val; 
  }
  async findValuationsByEmail(email: string): Promise<ValuationDocument[]> {
    const valuations = this.valuationModel.find({ email });
    return valuations;
  }
  async findAll(): Promise<ValuationDocument[]> {
    const valuations = this.valuationModel.find();
    return valuations;
  }

  async getSession(): Promise<ClientSession> {
    const session = this.valuationModel.db.startSession();
    return session;
  }
    async findValuationById(valId: string): Promise<ValuationDocument> {
      return this.valuationModel.findById(valId);
    }

    async findValuationBy_User_Trip(userId: string, trip: string): Promise<ValuationDocument> {
      return this.valuationModel.findOne({ userId, trip });
    }

    async findValuationsByUserId(userId: string): Promise<ValuationDocument[]> {
      return this.valuationModel.find({ userId });
    }

    async findValuationByUserId(userId: string): Promise<ValuationDocument[]> {
    return this.valuationModel.find({ userId });
    }

    async findValuation_ById_(id: string): Promise<ValuationDocument | null> {
    return this.valuationModel.findById(id);
    }

    async createValuation(valuation: Valuation): Promise<ValuationDocument> {
      const newValuation = new this.valuationModel(valuation);
      return newValuation.save();
    }

    async updateValuation(id: string, valuation: Valuation): Promise<ValuationDocument | null> {
      return this.valuationModel.findByIdAndUpdate(id, valuation, { new: true });
    }

    async deleteValuation(id: string): Promise<ValuationDocument > {
      const result = await this.valuationModel.findByIdAndDelete(id);
      return result;
    }

    async getAllValuation(): Promise<ValuationDocument[]> {
      return this.valuationModel.find();
    }
    async findByValuationId(userId: string): Promise<ValuationDocument[]> {
      const valuations = this.valuationModel
      .find({ userId })
      .sort({ createdTimestamp: 'desc' });
      return valuations;
    }

    // getValuationFromDoc(valuation: ValuationDocument): Valuation {
    //   const { _id, email, userId, tripId, puntaje, detalle, } = valuation;
    //   const val = new Valuation();
    //   val.id = _id;
    //   val.email = email;
    //   val.userId = userId;
    //   val.tripId = tripId;
    //   val.puntaje = puntaje;
    //   val.detalle = detalle;
    //   return val;
      
    // }

 
}
