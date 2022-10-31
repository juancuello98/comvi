import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class TransactionService {

  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly responseHelper : ResponseHelper
  ){}

  async processSendRequest(request: any, userEmail: string){
    await this.updateUserRequests(userEmail,request.id);
    await this.updateTripRequests(request.tripId,request.id)
    // await this.sendNotificacion(payload) TODO: Notificar al usuario conductor de la nueva solicitud en su viaje
  }
  
  async updateUserRequests(email: string, id: any) {
    const update = {"$push":{"joinRequests":id}}
    
    const user = await this.userModel.findOneAndUpdate({email:email},update);

    if(!user) return user;

    this.logger.log('updateUserRequests: User updated when new request in joinRequests.')

    return await user.save();
  }

  async updateTripRequests(tripId: string, requestId: string) : Promise<Trip & TripDocument>{
  
    const update = {"$push":{"tripsRequests":requestId}}
    
    const trip = await this.tripModel.findByIdAndUpdate(tripId,update);

    if(!trip) return trip;

    this.logger.log('updateTripRequests: Trip updated when new request in tripsRequests.')

    return await trip.save();
  }
}



