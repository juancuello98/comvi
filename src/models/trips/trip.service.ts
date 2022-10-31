import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from './dto/new-trip.dto';
import { Trip, TripDocument } from './trip.schema';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { TripStatus } from './enums/state.enum';
import { ResponseHelper } from '../../common/helpers/http/response.helper';


@Injectable()
export class TripService {

  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly responseHelper : ResponseHelper
  ) {}

  async findTripsByDriver(driverEmail: string): Promise<ResponseDTO> {
    console.log(driverEmail);
    const trips = await this.findByDriver(driverEmail);
    return this.responseHelper.makeResponse(false,'User trips found.',trips,HttpStatus.OK);
  }

  async findByDriver(driverEmail:string):Promise<TripDocument[]>{
    console.log(driverEmail);
    const trips = await this.tripModel.find({driverEmail}).exec();
    this.logger.log(`Trips of user ${driverEmail} founded. STATUS: SUCCESS`);
    return trips;
  }

  async findByStatus(status: string): Promise<TripDocument[]> {
    return this.tripModel.find({status}).exec();
  }

  async findAll(email: string): Promise<ResponseDTO> {

    let message = 'Trips not found';

    try {
      const items = await this.tripModel.find().exec();

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
}



