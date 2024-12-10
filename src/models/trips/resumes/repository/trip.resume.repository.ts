import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { NewResumeDTO } from '../dto/trip.resume.dto';
import { TripResume, TripResumeDocument } from '../trip.resume.schema';
import { ITripResumeRepository } from '../interface/trip.resume.repository.interface';

@Injectable()
export class TripResumeRepository implements ITripResumeRepository {
  constructor(
    @InjectModel(TripResume.name)
    private readonly tripResumeModel: Model<TripResumeDocument>,
  ) {}

  async findAll(): Promise<TripResume[]> {
    const trips = await this.tripResumeModel.find()
    .select('-__v -_id')
    .populate('passengers')
    .populate('valuations')
    .select('-__v -_id')
    .exec();
    return trips;
  }

  async findById(id: any): Promise<TripResume> {
    const trip = await this.tripResumeModel.findOne({id})
    .select('-__v -_id')
    .populate('passengers')
    .populate('valuations')
    .select('-__v -_id')
    .exec();
    return trip;
  }

  async update(resume: TripResume): Promise<TripResume> {
    const tripUpdated = await this.tripResumeModel.findByIdAndUpdate(resume.id, resume);
    return tripUpdated;
  }

  async create(resume: TripResume): Promise<TripResume> {
    
    const newResume = await this.tripResumeModel.create({
      ...resume
    });
    return newResume;
    
  }
}
