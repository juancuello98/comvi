import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { NewResumeDTO } from '../dto/trip.resume.dto';
import { TripResume, TripResumeDocument } from '../trip.resume.schema';
import { ITripResumeRepository } from '../interface/trip.repository.interface';
@Injectable()
export class TripResumeRepository implements ITripResumeRepository {
  constructor(
    @InjectModel(TripResume.name)
    private readonly tripResumeModel: Model<TripResumeDocument>,
  ) {}

  async findById(id: any): Promise<TripResume> {
    const trip = await this.tripResumeModel.findOne({ id })
      .select('-__v -_id')
      .populate('Users')
      .populate('Valuations')
      .select('-__v -_id')
      .exec();
    return trip;
  }

  async update(resume: TripResume, id: string): Promise<TripResume> {
    const tripUpdated = await this.tripResumeModel.findOneAndUpdate(resume, { id }, { new: true });
    return tripUpdated;
  }

  async create(resume: TripResume): Promise<TripResume> {
  const newResume = await this.tripResumeModel.create(resume);
    return newResume;
  }
}