import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { Request, RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { StatusRequest } from './enums/status.enum';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name);

  constructor(
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly responseHelper : ResponseHelper
  ){}

  async findByStatus(status: string): Promise<ResponseDTO> {
    const requests = this.requestModel.find({status}).exec();
    return this.responseHelper.makeResponse(true,'requests by status succesfully.',requests,HttpStatus.OK) 
  }

  async findMyRequests(email: string): Promise<ResponseDTO> {

    let message = 'Requests not found.';

    try {
      const items = await this.requestModel.find({email: email}).exec();

      if(items.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found requests';
    
      return this.responseHelper.makeResponse(false,message,items,HttpStatus.OK);

    } catch (error) {
      this.logger.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,error.message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(requestId: string): Promise<ResponseDTO> {
    try {
      
      let message = 'Successfully found requests';
      let status = HttpStatus.OK;
      let request = await this.requestModel.findById(requestId).exec();
      if (!request)
      {
        request = null;
        message = 'Not found requests';
        status = HttpStatus.NOT_FOUND;
      };
      return this.responseHelper.makeResponse(false, message,request,status);
    } catch (error) {
      this.logger.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //TODO: Enviar notificacion al usuario conductor del viaje de que tiene una nueva solicitud, crear modulo de notifiaciones
  //TODO: Hacer solo la creacion de la request , lo demas pasarlo a un modulo de transacciones.
  //TODO: Que los services estos sean para ABM nomas, las transacciones van en otro modulo, abstraer los metodos de moongose.
  
  async send( req: ExtendedRequestDTO ): Promise<ResponseDTO> {

    try {
      let partnerQuantity = ! req.partnerQuantity ? 0 : req.partnerQuantity;
      const newRequest = new this.requestModel(
      { 
        email : req.email,
        tripId : req.tripId,
        description : req.description,
        hasEquipment : req.hasEquipment,
        hasPartner : req.hasPartner,
        partnerQuantity : partnerQuantity,
        totalPassenger : 1 + partnerQuantity,
        createdTimestamp : new Date().toISOString(),
        status : StatusRequest.ON_HOLD
      });

      const requestCreated = await newRequest.save();

      return this.responseHelper.makeResponse(false,'Request was sended succesfully.',requestCreated,HttpStatus.OK);
 
    } catch (error) {
      this.logger.error(error);
      return this.responseHelper.makeResponse(false,`${RequestService.name}: error in send method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    request: RequestDocument
  ): Promise<RequestDocument> {
    return request.save();
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



