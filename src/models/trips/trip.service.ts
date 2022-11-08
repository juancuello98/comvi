import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { Trip, TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { TripStatus } from './enums/state.enum';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { TripResume, TripResumeDocument } from '../trips-resume/trips-resume.schema';
import { todayDateWithFormat } from 'src/common/helpers/date/date.helper';
import { User, UserDocument } from '../users/user.schema';
import { GetUserDTO } from '../users/dto/user.dto';
import { randomInt } from 'crypto';


@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(TripResume.name) private readonly tripResumeModel: Model<TripResumeDocument>,
    private readonly responseHelper : ResponseHelper
  ) {}

  async findTripsByDriver(driverEmail: string): Promise<ResponseDTO> {
    console.log(driverEmail);
    const trips = await this.findByDriver(driverEmail);
    return this.responseHelper.makeResponse(false,'User trips found.',trips,HttpStatus.OK);
  }

  async findByDriver(driverEmail:string):Promise<TripDocument[]>{
    console.log(driverEmail);
    const trips = await this.tripModel.find({driverEmail}).sort({createdTimestamp: 'desc'}).exec(); //TODO: Hacer generico el metodo este de buscar viajes por email y devolverlos ordenados
    this.logger.log(`Trips of user ${driverEmail} founded. STATUS: SUCCESS`);
    return trips;
  }

  async findByStatus(status: string): Promise<TripDocument[]> {
    return this.tripModel.find({status}).exec();
  }

  async findAll(email: string): Promise<ResponseDTO> {

    let message = 'Trips not found';

    try {
      const items = await this.tripModel.find().sort({createdTimestamp: 'desc'}).exec();

      if(items.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found trips';

      const itemsFiltered = items.filter(x => x.driverEmail !== email )

      if(itemsFiltered.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);
    
      return this.responseHelper.makeResponse(false,message,itemsFiltered,HttpStatus.OK);

    } catch (error) {
      console.error('Error in findAll: ',error);

      return this.responseHelper.makeResponse(true,message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(tripId: string): Promise<ResponseDTO> {
    try {
      
      let message = 'Successfully found trips';
      let status = HttpStatus.OK;
      let trip = await this.tripModel.findById(tripId).exec();
      if (!trip)
      {
        trip = null;
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
      };
      return this.responseHelper.makeResponse(false, message,trip,status);
    } catch (error) {
      console.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create( trip: NewTripDTO ): Promise<ResponseDTO> {

    const newTrip = new this.tripModel(
    { 
      driverEmail: trip.email,
      origin: trip.origin,
      destination: trip.destination,
      description: trip.description,
      allowPackage: trip.allowPackage,
      allowPassenger: trip.allowPassenger,
      peopleQuantity: trip.peopleQuantity,
      placesAvailable: trip.peopleQuantity,
      vehicle: trip.vehicle,
      startedTimestamp: trip.startedTimestamp,
      status: TripStatus.OPEN,
      createdTimestamp: new Date().toISOString()
    });

    const tripCreated = await newTrip.save();

    const resp : ResponseDTO = {
      hasError: false,
      message: 'Trip was created succesfully.',
      data: tripCreated,
      status: HttpStatus.CREATED

    }

    return resp;
  }

  async update(
    trip: TripDocument
  ): Promise<TripDocument> {
    return trip.save();
  }

  async cancel(id: string, userEmail: string): Promise<ResponseDTO> {

    this.logger.log('Initialize process to cancel trip...');

    const filter = {
      driverEmail: userEmail,
      _id: id
    }
    const hasUserTrip = await this.tripModel.findOne(filter);

    if(!hasUserTrip) return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`,null,HttpStatus.NOT_FOUND);

    if(hasUserTrip.status === TripStatus.READY_FOR_START || hasUserTrip.status === TripStatus.FINISHED)
    {
      return this.responseHelper.makeResponse(false,`Incorrect trip status: ${hasUserTrip.status}`,null,HttpStatus.OK);
    }

    hasUserTrip.status = TripStatus.CANCELED;

    const tripUpdated = hasUserTrip.save();
    
    this.logger.log(`Update trip status to ${hasUserTrip.status}`);
    
    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(false,`Trip successfully cancelled : ${id}`,tripUpdated,HttpStatus.OK);
  }

  async init(id: string, userEmail: string): Promise<ResponseDTO> {

    this.logger.log('Initialize process to init trip...');

    let today = todayDateWithFormat();

    const filter = {
      driverEmail: userEmail,
      _id: id
    }

    const hasUserTrip = await this.tripModel.findOne(filter);

    if(!hasUserTrip) return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`,null,HttpStatus.NOT_FOUND);

    if(hasUserTrip.status !== TripStatus.OPEN)
    {
      return this.responseHelper.makeResponse(false,`Incorrect trip status: ${hasUserTrip.status}`,null,HttpStatus.OK);
    }

    
    const dateTrip = hasUserTrip.startedTimestamp.substring(0,10);

    this.logger.log(`startedTimestamp ${dateTrip} and today is ${today}`);

    if( dateTrip !== today) {
      return this.responseHelper.makeResponse(false,`The trip contains a different start date: ${dateTrip}`,null,HttpStatus.OK);
    }

    if(hasUserTrip.passengers.length === 0){
      return this.responseHelper.makeResponse(false,`Your trip does not contain passengers: ${hasUserTrip.passengers.length}`,null,HttpStatus.OK);
    }

    hasUserTrip.status = TripStatus.IN_PROGRESS;
   
    const newTripResume = new this.tripResumeModel({
      passengers: hasUserTrip.passengers,
      fechaHoraRealInicio: new Date().toISOString()
    })
    
    newTripResume.save();

    this.logger.log(`Create new trip resume with id ${newTripResume.id}`);

    hasUserTrip.tripResumeId = newTripResume.id;

    const tripUpdated = hasUserTrip.save();

    this.logger.log(`Update trip status to ${hasUserTrip.status}`);
    
    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(false,`Trip successfully cancelled : ${id}`,tripUpdated,HttpStatus.OK);
  }

  async finish(id: string, userEmail: string): Promise<ResponseDTO> {

    this.logger.log('Initialize process to finish trip...');

    const filter = {
      driverEmail: userEmail,
      _id: id
    }

    const hasUserTrip = await this.tripModel.findOne(filter);

    if(!hasUserTrip) return this.responseHelper.makeResponse(false, `Not found trip ${id} for user ${userEmail}`,null,HttpStatus.NOT_FOUND);

    if(hasUserTrip.status !== TripStatus.IN_PROGRESS)
    {
      return this.responseHelper.makeResponse(false,`Incorrect trip status: ${hasUserTrip.status}`,null,HttpStatus.OK);
    }
    
    hasUserTrip.status = TripStatus.FINISHED;    

    const tripUpdated = hasUserTrip.save();
    
    this.logger.log(`Update trip status to ${hasUserTrip.status}`);
   
    const _filter = {_id: hasUserTrip.tripResumeId};
    const update = {fechaHoraRealFin: new Date().toISOString()};

    const tripResume = await this.tripResumeModel.findOneAndUpdate(_filter,update);

    tripResume.save();
    
    //await this.transactions.notifyUpdateTripStatus(hasUserTrip.passengers);

    return this.responseHelper.makeResponse(false,`Trip successfully finished : ${id}`,tripUpdated,HttpStatus.OK);
  }

  async listOfPassengers(tripId: string): Promise<ResponseDTO> {
    try {

      let message = 'Passengers inside the trip.';
      let status = HttpStatus.OK;
      
      const trip = await this.tripModel.findOne({_id: tripId}).exec();

      if (!trip)
      {
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
        return this.responseHelper.makeResponse(false, message,null,status);
      };
      
      const passengersOfTrip = await this.userModel.find().where('_id').in(trip.passengers);
      const resp = passengersOfTrip.map(x => this.userWraped(x));
      return this.responseHelper.makeResponse(false, message,resp,status);
      
    } catch (error) {
      console.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in listWithPassengers.',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  userWraped(user: any): any {
    return {
      name : user.name,
      lastname : user.lastname,
      email : user.email,
      quantityReviews : randomInt(3,8),
      averageRating: randomInt(1,5),
      identityHasVerified: true
    }
  }

  wrapperListWithPassengers(trip: Trip, passengers : any) {
    
    return {

    }
  }
}

