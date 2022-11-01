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
      const items = await this.requestModel.find({email: email}).sort({createdTimestamp: 'desc'}).exec();

      if(items.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found requests';

      const itemsWrapped = await Promise.all(items.map(async x => await this.addTripToRequest(x)));
    
      return this.responseHelper.makeResponse(false,message,itemsWrapped,HttpStatus.OK);

    } catch (error) {
      this.logger.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,error.message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async addTripToRequest(x: RequestDocument) {
    const trip = await this.tripModel.findById(x.tripId).exec();
    return this._getRequestDetails(x,trip);
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

  async getRequestsForTrips(email: string){
    try {
      const trips = await this.tripModel.find({driverEmail:email,status:'OPEN'});

      if(trips.length === 0) 
      {
        this.logger.log('Not found trips with OPEN status.')
        return this.responseHelper.makeResponse(false,`${RequestService.name}: The user not have trips OPEN.`,null,HttpStatus.NOT_FOUND);
      }

      this.logger.log('Init process to get requests from trips...');

      const requests = await Promise.all(trips.map(async x => await this.getRequests(x)));
      
      if(requests.length === 0)
      {
        this.logger.log('Not found requests in trips with OPEN status.')
        return this.responseHelper.makeResponse(false,`${RequestService.name}: The user driver not have trips with requests.`,null,HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Process finished. Requests: ${JSON.stringify(requests)}`);

      const responseRequests = requests.flat();

      responseRequests.sort(this.custom_sort);

      return this.responseHelper.makeResponse(false,`${RequestService.name}: Requests founded.`,responseRequests,HttpStatus.OK);
 
    } catch (error) {
      return this.responseHelper.makeResponse(true,`${RequestService.name}: error ${error.message}.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
   
  }
  
  custom_sort(a, b) {
    return new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime();
  }

  async getRequests( trip : TripDocument){
    let requests = [];

    for (const req in trip.tripsRequests) {

      let id = trip.tripsRequests[req];

      let requestFounded = await this.requestModel.findById(id);

      requests.push(this._getRequestDetails(requestFounded,trip));

      console.log(`${trip.id}: ${JSON.stringify(requests)}`);
    }

    return requests;
  }

  _getRequestDetails(request : RequestDocument, trip: TripDocument){
    return {
      id: request.id,
      email: request.email,
      description: request.description,
      hasEquipment: request.hasEquipment,
      hasPartner: request.hasPartner,
      partnerQuantity: request.partnerQuantity,
      totalPassenger: request.totalPassenger,
      createdTimestamp: request.createdTimestamp,
      status: request.status,
      tripId: request.tripId,
      trip: trip
    }
  }
}

