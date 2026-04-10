import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripRoute, TripRouteDocument } from 'src/travelling/tripRoute.schema';
import { ITripRouteRepository } from '../interface/tripRoute.repository.interface';

@Injectable()
export class TripRouteRepository implements ITripRouteRepository {
  constructor(
    @InjectModel(TripRoute.name) private readonly tripRouteModel: Model<TripRouteDocument>,
  ) {}

  async findAll(): Promise<TripRoute[]> {
    const tripsRoute = await this.tripRouteModel.find()
    .select('-__v -_id')
    return tripsRoute;
  }

  async findById(id: any): Promise<TripRoute> {
    const tripRoute = await this.tripRouteModel.findOne({id})
    .select('-__v -_id')
    .exec();
    return tripRoute;
  }

  async findByIdWithStations(id: any): Promise<TripRoute> {
    const tripRoute = await this.tripRouteModel.findOne({id})
    .select('-__v -_id')
    .populate({
      path: 'stations',
      select: '-__v -_id'
    })
    .exec();
    return tripRoute;
  }

  async update(tripRoute: TripRoute): Promise<TripRoute> {
    const tripRouteUpdated = await this.tripRouteModel.findByIdAndUpdate(tripRoute.id, tripRoute);
    return tripRouteUpdated;
  }

  async create(tripRoute: TripRoute): Promise<TripRoute> {
    
    const newTripRoute = await this.tripRouteModel.create({
      ...tripRoute
    });
    return newTripRoute;
    
  }
}
