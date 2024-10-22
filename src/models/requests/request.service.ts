import { HttpStatus, Inject, Injectable, Logger, Res } from '@nestjs/common';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestDocument,Request } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { StatusRequest } from './enums/status.enum';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { MailService } from 'src/mail/config.service';
import { IREQUEST_REPOSITORY } from './repository/constants/request.repository.constant';
import { IRequestRepository } from './Interfaces/request.repository.interface';
import { ITRIP_REPOSITORY } from '@/trips/repository/constants/trip.repository.constant';
import { ITripRepository } from '@/trips/interface/trip.repository.interface';
import {IUSER_REPOSITORY} from '@/users/repository/constants/user.repository.constant';
import { IUserRepository } from '@/users/interfaces/user.repository.interface';
import { changeStatusInterface } from './Interfaces/changeStatus.Interface';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { TripDocument, TripResume } from '../trips';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from '@/trips/enums/state.enum';
import { ITRIP_RESUME_REPOSITORY } from '@/trips/resumes/constants/trip.resume.repository.constant';
import { ITripResumeRepository } from '@/trips/resumes/interface/trip.resume.repository.interface';
@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name);

  constructor(
    @Inject(ITRIP_REPOSITORY) private readonly tripRepository: ITripRepository,
    private mailService: MailService,
    @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ITRIP_RESUME_REPOSITORY) private readonly tripResumeRepository: ITripResumeRepository,
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
      const items = await this.requestRepository.find({email});

      if(items.length == 0) {this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);}

      message = 'Requests founded succesfully.';

      const itemsWrapped = await Promise.all(items.map(async x => await this.addTripToRequest(x)));

      return this.responseHelper.makeResponse(false,message,itemsWrapped,HttpStatus.OK);

    } catch (error) {
      this.logger.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,error.message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeStatusOfRequest(req:ChangeStatusOfRequestDTO, actionerEmail:string, varStatusRequest:StatusRequest): Promise<changeStatusInterface> {
    try {

      const request = await this.requestRepository.findById(req.requestId);
      const trip = await this.tripRepository.findById(request.tripId.toString());

      let response;
      if(!request)  {
        response= this.responseHelper.makeResponse(true,'Request not found.',null,HttpStatus.NOT_FOUND)
      
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }
      if(trip.driver.email != actionerEmail && request.email != actionerEmail) { //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema) {
        this.logger.error('You can only response requests from your OWN trip');
        response = this.responseHelper.makeResponse(true,'You can only response requests from your OWN trip',null,HttpStatus.UNAUTHORIZED);
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }

      if(request.status == StatusRequest.CANCELLED){
        this.logger.error('You can not change cancelled requests');
        response = this.responseHelper.makeResponse(true,'You can not response to cancelled requests',null,HttpStatus.UNPROCESSABLE_ENTITY);
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }

      if (request.status == varStatusRequest) {
        this.logger.error('Request already has this status.');
        response = this.responseHelper.makeResponse(true,'Request already has this status.',null,HttpStatus.UNPROCESSABLE_ENTITY);
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }

      if (trip.status != undefined && trip.status != TripStatus.OPEN) {
        this.logger.error('You can only response requests from OPEN trips');
        response = this.responseHelper.makeResponse(true,'You can only response requests from OPEN trips',null,HttpStatus.UNAUTHORIZED);
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }

      if(varStatusRequest==StatusRequest.CANCELLED && request.email != actionerEmail ) {//(trip.driverSchema.email != actionerEmail) { //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema 
        this.logger.error("You can not cancel to anotherone's request");
        response = this.responseHelper.makeResponse(true,"You can not cancel to anotherone's request",null,HttpStatus.UNAUTHORIZED);
        return {
          actioner: null,
          passenger: null,
          trip: null,	
          request: null,
          response: response
        }
      }


      request.status = varStatusRequest;

      const passengerUser = await this.userRepository.findByEmail( request.email );

      const actioner = await this.userRepository.findByEmail(actionerEmail);
      
      
     
    try {
      await request.save();
    } 
    catch (saveError) {
      this.logger.error(`Error saving request: ${saveError.message}`);
      response = this.responseHelper.makeResponse(true, 'Error saving request.', null, HttpStatus.INTERNAL_SERVER_ERROR);
      return {
          actioner: actioner,
          passenger: passengerUser,
          trip: trip,
          request: request,
          response: response
      };
  }



     
      return {
        actioner: actioner,
        passenger: passengerUser,
        trip: trip,	
        request: request,
        response: response  
      }
    } catch (error) {
      this.logger.error(`Error in changeStatusOfRequest: ${error.message}`);
      throw error; // O manejar el error según sea necesario
  }

  }

  async addTripToRequest(x: RequestDocument) {
    const trip = await this.tripRepository.findById(x.tripId.toString());
    return this._getRequestDetails(x,trip);
  }

  async findRequestById(requestId: string, userEmail:string ): Promise<ResponseDTO> {
    try {

      const request = await this.requestRepository.findById(requestId);

      if(!request) return this.responseHelper.makeResponse(true,'Request not found.',null,HttpStatus.NOT_FOUND);

      if(request.email != userEmail){
        return this.responseHelper.makeResponse(true,'You can only see your own requests.',null,HttpStatus.UNAUTHORIZED);
      }
      
      if(request.status == StatusRequest.CANCELLED){
        return this.responseHelper.makeResponse(true,'Request was cancelled.',null,HttpStatus.UNPROCESSABLE_ENTITY);
      } //Juan deberíamos decirle este estado?

      const message = 'Request found succesfully.';
      const status = HttpStatus.OK;
      
      return this.responseHelper.makeResponse(false, message,request,status);
    } catch (error) {
      this.logger.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async acceptRequest(req:ChangeStatusOfRequestDTO, driverEmail:string): Promise<ResponseDTO> {
    try{
      const {request, response, passenger,actioner, trip} = await this.changeStatusOfRequest(req,driverEmail,StatusRequest.ACCEPTED);
      
      if (response) return response;

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,actioner.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema

      return this.responseHelper.makeResponse(false,'Request accepted succesfully.',null,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rejectRequest(req:ChangeStatusOfRequestDTO, driverEmail:string): Promise<ResponseDTO> {

    try{
      const {request, response, passenger,actioner, trip} = await this.changeStatusOfRequest(req,driverEmail,StatusRequest.REJECTED);
      
      if (response) return response;
      
      // const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,driver.name,trip.origin.locality,trip.destination.locality,req.description);

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendRejectedRequestNotification(passenger.email,passenger.name,actioner.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema


      return this.responseHelper.makeResponse(false,'Request rejected succesfully.',null,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
     

  }

  async cancelRequest(req:ChangeStatusOfRequestDTO, passengerEmail:string): Promise<ResponseDTO> {

    try{

      const {request, response, passenger,actioner, trip} = await this.changeStatusOfRequest(req,passengerEmail,StatusRequest.CANCELLED);
      
      if (response) return response;
      
      // const mail = await this.mailService.sendAcceptedRequestNotification(passenger.email,passenger.name,driver.name,trip.origin.locality,trip.destination.locality,req.description);

      const origin = trip.origin.locality //Juan fijate que cuando uso la prop origin no me deja usar la prop locality

      const destination = trip.destination.locality //Juan fijate que cuando uso la prop destination no me deja usar la prop locality
      
      const mail = await this.mailService.sendCanceledRequestNotification(passenger.email,passenger.name,actioner.name,origin,destination,req.description); //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema

      return this.responseHelper.makeResponse(false,'Request canceled succesfully.',request,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: ${error.name} in send method.\n${error.message}`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
  
  async send( req: ExtendedRequestDTO ): Promise<ResponseDTO> {
    
    try {
      const user = await this.userRepository.findByEmail(req.email);
      if(!user || typeof user !== 'object'){
        return this.responseHelper.makeResponse(true,'User not found or invalid.',null,HttpStatus.NON_AUTHORITATIVE_INFORMATION);
      }
      
      const trip = await this.tripRepository.findById(req.tripId);

      if(!trip || typeof trip !== 'object'){
        return this.responseHelper.makeResponse(true,'Trip not found or invalid.',null,HttpStatus.UNPROCESSABLE_ENTITY);
      }
      
      const alredryRequested = await this.requestRepository.find({email:req.email,tripId:req.tripId});
      if(alredryRequested.length > 0){
        console.log(alredryRequested[0]._id);
        console.log(alredryRequested[0].id);
        
        if(alredryRequested[0].status == StatusRequest.CANCELLED)
        {
          
          let partnerQuantity = ! req.partnerQuantity ? 0 : req.partnerQuantity;
          const newRequest = new Request();
          newRequest.userId = user.id;
          newRequest.email = req.email;
          newRequest.tripId =  trip.id;
          newRequest.description = req.description;
          newRequest.hasEquipment = req.hasEquipment;
          newRequest.hasPartner = req.hasPartner;
          newRequest.partnerQuantity = partnerQuantity;
          newRequest.totalPassenger = 1 + partnerQuantity;
          newRequest.createdTimestamp = new Date().toISOString();
          newRequest.status = StatusRequest.ON_HOLD;        
        
        const result =  await this.requestRepository.update(alredryRequested[0].id,newRequest);
        
        

        const driverEmail = trip.driver.email; //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema  
        const driver = trip.driver; //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema
        const origin = trip.origin.locality; //Juan fijate que cuando uso la prop origin no me deja usar la prop locality 
        const destination = trip.destination.locality; //Juan fijate que cuando uso la prop destination no me deja usar la prop locality

        const mail = await this.mailService.sendNewRequestNotification(
          result.email,
          user.name,
          driver.name,
          origin,
          destination,
          result.description,
        );


        return this.responseHelper.makeResponse(false,'Request was sended succesfully.',result,HttpStatus.OK);

          
        }
        return this.responseHelper.makeResponse(true,'You already have a request for this trip.',null,HttpStatus.BAD_REQUEST);
      }
      

      let partnerQuantity = ! req.partnerQuantity ? 0 : req.partnerQuantity;
      const newRequest = new Request();
      newRequest.userId = user.id;
      newRequest.email = req.email;
      newRequest.tripId =  trip.id;
      newRequest.description = req.description;
      newRequest.hasEquipment = req.hasEquipment;
      newRequest.hasPartner = req.hasPartner;
      newRequest.partnerQuantity = partnerQuantity;
      newRequest.totalPassenger = 1 + partnerQuantity;
      newRequest.createdTimestamp = new Date().toISOString();
      newRequest.status = StatusRequest.ON_HOLD;        
    
    const result =  await this.requestRepository.create(newRequest);

    const driver = trip.driver; //Juan fijate que cuando uso la prop driverSchema no me deja usar el mail || cambiar por driverSchema  
    const origin = trip.origin.locality; //Juan fijate que cuando uso la prop origin no me deja usar la prop locality 
    const destination = trip.destination.locality; //Juan fijate que cuando uso la prop destination no me deja usar la prop locality

    const mail = await this.mailService.sendNewRequestNotification(
      result.email,
      user.name,
      driver.name,
      origin,
      destination,
      result.description,
    );


    return this.responseHelper.makeResponse(false,'Request was sended succesfully.',result,HttpStatus.OK);

    } catch (error) {
      this.logger.error(error);
      return this.responseHelper.makeResponse(false,`${RequestService.name}: error in send method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update( request: RequestDocument): Promise<ResponseDTO> {
    try{
      request = await this.requestRepository.update(request.id,request);
      if(!request) return this.responseHelper.makeResponse(true,'Request not found.',null,HttpStatus.NOT_FOUND);

      this.logger.log('Request updated succesfully.');
      return this.responseHelper.makeResponse(false,'Request updated succesfully.',request,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${RequestService.name}: error in update method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRequestsByTrips(email: string){ //TODO: Ver si se puede hacer como en sql la request al mongodb # en eso jmc
    try {
      
      const driver = await this.userRepository.findByEmail(email);

      const trips = await this.tripRepository.find({driver: driver.id});
      
      if(trips.length === 0)
      {
        this.logger.log('Not found trips with OPEN status.')
        return this.responseHelper.makeResponse(false,`${RequestService.name}: The user not have trips`,null,HttpStatus.NOT_FOUND);
      }

      let requests: RequestDocument[] = [];

      await Promise.all(trips.map(async x => await this.requestRepository.find({tripId: x.id}).then( async req => requests.concat(req))));

      await await this.requestRepository.find({email: email}).then( async req => requests.concat(req));

      await Promise.all(requests.map(async x => await this.addTripToRequest(x)));

      this.logger.log('Init process to get requests from trips...');

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

  async findAllRequests()
  {
    try {
      
      const requests = await this.requestRepository.findAll();

  //TODO: Revidar TripId

      if(requests.length === 0)
      {
        this.logger.log('Not found requests with.')
        return this.responseHelper.makeResponse(false,`${RequestService.name}: Not found requests.`,null,HttpStatus.NOT_FOUND);
      }

      this.logger.log('Init process to get requests from trips...');

      this.logger.log(`Process finished. Requests: ${JSON.stringify(requests)}`);

      // const responseRequests = requests.flat();

      // responseRequests.sort(this.custom_sort);

      return this.responseHelper.makeResponse(false,`${RequestService.name}: Requests founded.`,requests,HttpStatus.OK);

    } catch (error) {
      return this.responseHelper.makeResponse(true,`${RequestService.name}: error ${error.message}.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getRequestsByTripsId(tripId: string){
    try {
      
      const trip = await this.tripRepository.findById(tripId);

      if(!trip)
      {
        this.logger.log('Not found trips with OPEN status.')
        return this.responseHelper.makeResponse(false,`${RequestService.name}: The user not have trips`,null,HttpStatus.NOT_FOUND);
      }

      let requests: RequestDocument[] = [];

      requests = await this.requestRepository.find({tripId: tripId});

      this.logger.log('Init process to get requests from trips...');

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

  async _getRequestDetails(request : RequestDocument, trip: TripDocument){
    const user = await this.userRepository.findByEmail(request.email);
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
      trip: trip,
      user: {
        name : user.name,
        lastname: user.lastname
      }
    }
  }

  // async processSendRequest(request: any, userEmail: string){
  //   await this.userService.updateUserRequests(userEmail,request.id);
  //   await this.tripService.updateTripRequests(request.tripId,request.id)
  //   await this.sendNotificacion(payload) TODO: Notificar al usuario conductor de la nueva solicitud en su viaje
  // }

}
