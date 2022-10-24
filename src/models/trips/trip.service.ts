import { HttpStatus, Injectable, Logger, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripDetails } from '../trips/interface/trips-details.interface';
import { NewTripDTO } from './dto/new-trip.dto';
import { UserService } from '../users/user.service';
import { Trip, TripDocument } from './trip.schema';
import { randomInt } from 'crypto';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { TripStatus } from './enums/state.enum';
import { Filters } from './enums/filters.enum';

@Injectable()
export class TripService {

  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    private readonly userService: UserService,
  ) {}

  async findTripsByDriver(driverEmail: string): Promise<ResponseDTO> {
    console.log(driverEmail);
    const trips = await this.findByDriver(driverEmail);
    return this.makeResponse(false,'User trips found.',trips,HttpStatus.OK);
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

    console.log('findAll: ', email);

    let message = 'Trips not found';

    try {
      const items = await this.tripModel.find().exec();

      if(items.length == 0) this.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found trips';

      const itemsFiltered = items.filter(x => x.driverEmail !== email )

      if(itemsFiltered.length == 0) this.makeResponse(false,message,null,HttpStatus.NOT_FOUND);
    
      return this.makeResponse(false,message,itemsFiltered,HttpStatus.OK);

    } catch (error) {
      console.error('Error in findAll: ',error);

      return this.makeResponse(true,message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(tripId: string): Promise<ResponseDTO> {
    try {
      let trip = await this.tripModel.findById(tripId).exec();
      if (!trip) trip = null;
      const message = 'Successfully found trips';
      return this.makeResponse(false, message,trip,HttpStatus.OK );
    } catch (error) {
      console.error('Error: ',error);
      return this.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create( trip: NewTripDTO ): Promise<ResponseDTO> {

    const newTrip = new this.tripModel(
    { 
      driverEmail: trip.email,
      origin: trip.origin,
      destination: trip.destination,
      allowPackage: trip.allowPackage,
      allowPassenger: trip.allowPassenger,
      peopleQuantity: trip.peopleQuantity,
      placesAvailable: trip.peopleQuantity,
      vehicle: trip.vehicle,
      checkIn: trip.startedTimestamp,
      status: TripStatus.OPEN,
      createdTimestamp: Date.now().toString()
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

  makeResponse = (hasError: boolean, message: string,data:any,status: HttpStatus) : ResponseDTO => {
    return {
      hasError: hasError,
      message: message,
      data: data,
      status: status
    }
  }
}



