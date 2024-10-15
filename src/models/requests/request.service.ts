import { HttpStatus, Inject, Injectable, Logger, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { Request, RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { StatusRequest } from './enums/status.enum';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { Exception } from 'handlebars';
import { MailService } from 'src/mail/config.service';
import { UserService } from '../users/user.service';
import { TripService } from '../trips/trip.service';
import { IREQUEST_REPOSITORY } from './repository/constants/request.repository.constant';
import { IRequestRepository } from './Interfaces/request.repository.interface';
import { ITRIP_REPOSITORY } from '@/trips/repository/constants/trip.repository.constant';
import { ITripRepository } from '@/trips/interface/trip.repository.interface';
import {IUSER_REPOSITORY} from '@/users/repository/constants/user.repository.constant';
import { IUserRepository } from '@/users/interfaces/user.repository.interface';
import { changeStatusInterface } from './Interfaces/changeStatus.Interface';
@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name);

  constructor(
    @Inject(ITRIP_REPOSITORY) private readonly tripRepository: ITripRepository,
    private mailService: MailService,
    @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
    private userService: UserService,
    private tripService: TripService,
    private readonly responseHelper : ResponseHelper,
    @Inject(IREQUEST_REPOSITORY) private readonly requestRepository: IRequestRepository,
  ){}

//   async findByStatus(status: string): Promise<ResponseDTO> {
//     const requests = this.requestRepository.find({status}).exec();
//     return this.responseHelper.makeResponse(true,'requests by status succesfully.',requests,HttpStatus.OK)
//   }

  async findMyRequests(email: string): Promise<ResponseDTO> {

    let message = 'Requests not found.';

    try {
      const items = await this.requestRepository.find({email}).exec();

      if(items.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found requests';

      const itemsWrapped = await Promise.all(items.map(async x => await this.addTripToRequest(x)));

      return this.responseHelper.makeResponse(false,message,itemsWrapped,HttpStatus.OK);

    } catch (error) {
      this.logger.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,error.message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeStatusOfRequest(req:ChangeStatusOfRequestDTO, driverEmail:string, varStatusRequest:StatusRequest): Promise<changeStatusInterface> {
    try {

      const request = await this.requestRepository.findById(req.requestId);
      const trip = await this.tripRepository.findById(request.tripId);

      let response;

      if(request.status == StatusRequest.CANCELLED){
        this.logger.error('You can not response to cancelled requests');
        response = this.responseHelper.makeResponse(true,'You can not response to cancelled requests',null,HttpStatus.UNPROCESSABLE_ENTITY);
      }

      if(trip.driver != driverEmail) {//(trip.driverSchema.email != driverEmail) { //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema 
        this.logger.error('You can only response requests from your OWN trip');
        response = this.responseHelper.makeResponse(true,'You can only response requests from your OWN trip',null,HttpStatus.UNAUTHORIZED);
      }

      request.status = varStatusRequest;

      const passengerUser = await this.userRepository.findByEmail( request.email );

      const driverUser = await this.userRepository.findByEmail(driverEmail);

      trip.passengers.push(passengerUser.id);

      const session = await this.requestRepository.startSession();
      session.startTransaction();
      try {
        await request.save({ session }); // debería esperar?
        await trip.save({ session }); // debería esperar?
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      return {
        driver: driverUser,
        passenger: passengerUser,
        trip: trip,	
        request: request,
        response: response  
      }
    } catch (error) {
      this.logger.error(error);
      throw error
      // return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async addTripToRequest(x: RequestDocument) {
    const trip = await this.tripRepository.findById(x.tripId);
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

  async acceptRequest(req:ChangeStatusOfRequestDTO, driverEmail:string): Promise<ResponseDTO> {
    try{
      const {request, response, passenger,driver, trip} = await this.changeStatusOfRequest(req,driverEmail,StatusRequest.ACCEPTED);
      
      if (response) return response;

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,driver.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema

      return this.responseHelper.makeResponse(false,'Request accepted succesfully.',null,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rejectRequest(req:ChangeStatusOfRequestDTO, driverEmail:string): Promise<ResponseDTO> {

    try{
      const {request, response, passenger,driver, trip} = await this.changeStatusOfRequest(req,driverEmail,StatusRequest.REJECTED);
      
      if (response) return response;
      
      // const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,driver.name,trip.origin.locality,trip.destination.locality,req.description);

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendRejectedRequestNotification(passenger.email,passenger.name,driver.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema


      return this.responseHelper.makeResponse(false,'Request accepted succesfully.',null,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
     

  }

  async cancelRequest(req:ChangeStatusOfRequestDTO, passengerEmail:string): Promise<ResponseDTO> {

    try{
      const {request, response, passenger,driver, trip} = await this.changeStatusOfRequest(req,passengerEmail,StatusRequest.CANCELLED);
      
      if (response) return response;
      
      // const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,driver.name,trip.origin.locality,trip.destination.locality,req.description);

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendRejectedRequestNotification(passenger.email,passenger.name,driver.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema


      return this.responseHelper.makeResponse(false,'Request accepted succesfully.',null,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
  // async send( req: ExtendedRequestDTO ): Promise<ResponseDTO> {
    
  //   try {
  //     const user = await this.userRepository.findByEmail(req.email);
  //     if(!user){
  //       return this.responseHelper.makeResponse(true,'User not found.',null,HttpStatus.NOT_FOUND);
  //     }
  //     const alredryRequested = await this.requestRepository.find({email:req.email,tripId:req.tripId,status:StatusRequest.ON_HOLD});
  //     if(alredryRequested){
  //       return this.responseHelper.makeResponse(true,'You already have a request for this trip.',null,HttpStatus.BAD_REQUEST);
  //     }
  //     let partnerQuantity = ! req.partnerQuantity ? 0 : req.partnerQuantity;
  //     const newRequest = new Request();
  //     newRequest.email = req.email;
  //     newRequest.tripId = req.tripId;
  //     newRequest.description = req.description;
  //     newRequest.hasEquipment = req.hasEquipment;
  //     newRequest.partnerQuantity = partnerQuantity;
  //     newRequest.totalPassenger = 1 + partnerQuantity;
  //     newRequest.createdTimestamp = new Date().toISOString();
  //     newRequest.status = StatusRequest.ON_HOLD;        
    
  //   const requestCreated =  await this.requestRepository.create(newRequest);

  //   const result = this.requestRepository.getRequest(requestCreated);

  //   const trip = await this.tripRepository.findById(req.tripId);

  //   const driverEmail = trip.driver; //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema  
  //   const driver = await this.userRepository.findByEmail(driverEmail);
  //   const origin = trip.origin.locality; //Juan fijate que cuando uso la prop origin no me deja usar la prop locality 
  //   const destination = trip.destination.locality; //Juan fijate que cuando uso la prop destination no me deja usar la prop locality

  //   const mail = await this.mailService.sendNewRequestNotification(
  //     requestCreated.email,
  //     user.name,
  //     driver.name,
  //     origin,
  //     destination,
  //     requestCreated.description,
  //   );


  //   return this.responseHelper.makeResponse(false,'Request was sended succesfully.',result,HttpStatus.OK);

  //   } catch (error) {
  //     this.logger.error(error);
  //     return this.responseHelper.makeResponse(false,`${RequestService.name}: error in send method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async update(
  //   request: RequestDocument
  // ): Promise<ResponseDTO> {
  //   try{
  //     request = await this.requestRepository.update(request.id,request);
  //     this.logger.log('Request updated succesfully.');
  //     return this.responseHelper.makeResponse(false,'Request updated succesfully.',request,HttpStatus.OK);
  //   }
  //   catch(error){
  //     this.logger.error(error);
  //     return ResponseDTO.makeResponse(true,`${RequestService.name}: error in update method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async getRequestsForTrips(email: string){ //TODO: Ver si se puede hacer como en sql la request al mongodb # en eso jmc
  //   try {
  //     const trips = await this.tripModel.find({driverEmail:email,status:'OPEN'});
  //      Obtener las solicitudes abiertas para el trip
  //   const openRequests = await Request.find({ trip: tripId});

  //     if(trips.length === 0)
  //     {
  //       this.logger.log('Not found trips with OPEN status.')
  //       return this.responseHelper.makeResponse(false,`${RequestService.name}: The user not have trips OPEN.`,null,HttpStatus.NOT_FOUND);
  //     }

  //     this.logger.log('Init process to get requests from trips...');

  //     const requests = await Promise.all(trips.map(async x => await this.getRequests(x)));

  //     if(requests.length === 0)
  //     {
  //       this.logger.log('Not found requests in trips with OPEN status.')
  //       return this.responseHelper.makeResponse(false,`${RequestService.name}: The user driver not have trips with requests.`,null,HttpStatus.NOT_FOUND);
  //     }

  //     this.logger.log(`Process finished. Requests: ${JSON.stringify(requests)}`);

  //     const responseRequests = requests.flat();

  //     responseRequests.sort(this.custom_sort);

  //     return this.responseHelper.makeResponse(false,`${RequestService.name}: Requests founded.`,responseRequests,HttpStatus.OK);

  //   } catch (error) {
  //     return this.responseHelper.makeResponse(true,`${RequestService.name}: error ${error.message}.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  // }

  custom_sort(a, b) {
    return new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime();
  }

  // async getRequests( trip : TripDocument){
  //   let requests = [];

  //   for (const req in trip.tripsRequests) {

  //     let id = trip.tripsRequests[req];

  //     let requestFounded = await this.requestModel.findById(id);

  //     requests.push(await this._getRequestDetails(requestFounded,trip));

  //     console.log(`${trip.id}: ${JSON.stringify(requests)}`);
  //   }

  //   return requests;
  // }

  // async _getRequestDetails(request : RequestDocument, trip: TripDocument){
  //   const user = await this.userRepository.findOne({ email: request.email }).exec();
  //   return {
  //     id: request.id,
  //     email: request.email,
  //     description: request.description,
  //     hasEquipment: request.hasEquipment,
  //     hasPartner: request.hasPartner,
  //     partnerQuantity: request.partnerQuantity,
  //     totalPassenger: request.totalPassenger,
  //     createdTimestamp: request.createdTimestamp,
  //     status: request.status,
  //     tripId: request.tripId,
  //     trip: trip,
  //     user: {
  //       name : user.name,
  //       lastname: user.lastname
  //     }
  //   }
  // }

  // async processSendRequest(request: any, userEmail: string){
  //   await this.userService.updateUserRequests(userEmail,request.id);
  //   await this.tripService.updateTripRequests(request.tripId,request.id)
  //   await this.sendNotificacion(payload) TODO: Notificar al usuario conductor de la nueva solicitud en su viaje
  // }

}
