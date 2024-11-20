
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Valuation } from '../entities/valuation.schema';
import { IValuationRepository } from '../interfaces/valuations.repository.interface';

export class ValuationsMongodbRepository implements IValuationRepository {

  constructor(
    @InjectModel(Valuation.name) private readonly valuationModel: Model<Valuation>,
  ) {}
  getValuationFromDoc(valuation: Valuation): Valuation {
    const { user, trip, puntaje, detalle, } = valuation;
    const val = new Valuation();
    val.user = user;
    val.trip = trip;
    val.puntaje = puntaje;
    val.detalle = detalle;
    return val; 
  }
  async findValuationsByEmail(email: string): Promise<Valuation[]> {
    const valuations = this.valuationModel.find({ email });
    return valuations;
  }
  async findAll(): Promise<Valuation[]> {
    const valuations = this.valuationModel.find();
    return valuations;
  }

  async getSession(): Promise<ClientSession> {
    const session = this.valuationModel.db.startSession();
    return session;
  }
    async findValuationById(valId: string): Promise<Valuation> {
      return this.valuationModel.findById(valId);
    }

    async findValuationBy_User_Trip(userId: string, trip: string): Promise<Valuation> {
      return this.valuationModel.findOne({ userId, trip });
    }

    async findValuation_ById_(id: string): Promise<Valuation | null> {
    return this.valuationModel.findById(id);
    }

    async createValuation(valuation: Valuation): Promise<Valuation> {
      const newValuation = new this.valuationModel(valuation);
      return newValuation.save();
    }

    async updateValuation(id: string, valuation: Valuation): Promise<Valuation | null> {
      return this.valuationModel.findByIdAndUpdate(id, valuation, { new: true });
    }

    async deleteValuation(id: string): Promise<Valuation > {
      const result = await this.valuationModel.findByIdAndDelete(id);
      return result;
    }

    async getAllValuation(): Promise<Valuation[]> {
      return this.valuationModel.find();
    }
    async findByValuationId(userId: string): Promise<Valuation[]> {
      const valuations = this.valuationModel
      .find({ userId })
      .sort({ createdTimestamp: 'desc' });
      return valuations;
    }

 

 
}
