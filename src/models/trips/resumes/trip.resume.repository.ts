import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewResumeDTO } from './dto/trip.resume.dto';
import { TripResume, TripResumeDocument } from './trip.resume.schema';

@Injectable()
export class TripResumeRepository {
  constructor(
    @InjectModel(TripResume.name)
    private readonly tripResumeModel: Model<TripResumeDocument>,
  ) {}

  async findById(id: any): Promise<TripResumeDocument> {
    const trip = await this.tripResumeModel.findOne({id})
    .select('-__v -_id')
    .populate('Users')
    .populate('Valuations')
    .select('-__v -_id')
    .exec();
    return trip;
  }

  async update(resume: TripResumeDocument) {
    const tripUpdated = await resume.save();
    return tripUpdated;
  }

  async create(resume: NewResumeDTO) {
    const createdTimestamp = new Date().toISOString();
    const newResume = await this.tripResumeModel.create({
      ...resume,
      createdTimestamp
    });
    return newResume;
    
  }
}
