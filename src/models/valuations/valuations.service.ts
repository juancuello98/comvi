import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';

import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ResponseDTO } from '../../common/interfaces/responses.interface';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { Valuation  } from './entities/valuation.schema';
import { IVALUATION_REPOSITORY } from './repository/constants/valuations.repository.constant';
import { IValuationRepository } from './interfaces/valuations.repository.interface';

import { TripResume } from '@/trips/resumes/trip.resume.schema';
import { TripResumeService } from '@/trips/resumes/tripResume.service';
import { UserService } from '@/users/user.service';
import { TripService } from '../trips';
@Injectable()
export class ValuationsService {
  private readonly logger = new Logger(ValuationsService.name);

  constructor(
    @Inject(IVALUATION_REPOSITORY) private readonly valuationRepository: IValuationRepository,
    private readonly tripService: TripService,
    private readonly userService: UserService,
    private readonly tripResumeService: TripResumeService,

    private readonly responseHelper: ResponseHelper,
  ) {}

  async createController(createValuationDto: CreateValuationDto):Promise<ResponseDTO> {
    try{
    const user = await this.userService.findByEmail(createValuationDto.email);
    const trip = await this.tripService.findById(createValuationDto.tripId);

    if(!user){
      this.logger.log('User not found');	
      return this.responseHelper.makeResponse(true, 'User not found', null, HttpStatus.NOT_FOUND);
    }
    if(!trip){
      this.logger.log('Trip not found');	
      return this.responseHelper.makeResponse(true, 'Trip not found', null, HttpStatus.NOT_FOUND);
    }

    if(this.tripService.canHaveValuations(trip)){
      this.logger.log('The trip is can have valuations yet');	
      return this.responseHelper.makeResponse(true, 'The trip is not finished yet', null, HttpStatus.CONFLICT);
    }

    const alredyValuated = await this.valuationRepository.findValuationBy_User_Trip(user.email, trip.id);

    if(alredyValuated){
      this.logger.log('The user already valuated this trip');	
      return this.responseHelper.makeResponse(true, 'The user already valuated this trip', null, HttpStatus.CONFLICT);
    }
    
    const input = new Valuation();
    input.trip = createValuationDto.tripId;
    input.puntaje = createValuationDto.puntaje;
    input.detalle = createValuationDto.detalle;
    input.user = user.email;
    
    const newValuation = await this.valuationRepository.createValuation(input);
    
    const tripResId = typeof trip.tripResumeId == "string" ? trip.tripResumeId : trip.tripResumeId.id;
    
    let tripResume = await this.tripResumeService.findById(tripResId);
    
    if(!tripResume){
      tripResume = await this.tripResumeService.createTripResumeFromTrip(trip);
    }
    else{
      tripResume.valuations.push(newValuation as unknown as string & Valuation);
      tripResume = await this.tripResumeService.updateTripResume(tripResume);
    }
    trip.tripResumeId = tripResume.id;
    
    const tripUpdated = await this.tripService.update(trip);
    
      
    return this.responseHelper.makeResponse(false, 'Valuation created', newValuation, HttpStatus.CREATED);
   
    } catch (error) {
      this.logger.log('Error in create: ', error);

      return this.responseHelper.makeResponse(
        true,
        'The valuation was not created',
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async create(createValuationDto: CreateValuationDto):Promise<Valuation> {
    try{
    const user = await this.userService.findByEmail(createValuationDto.email);
    const trip = await this.tripService.findById(createValuationDto.tripId);

    if(!user){
      this.logger.log('User not found');	
      throw new Error('User not found');
    }
    if(!trip){
      this.logger.log('Trip not found');	
      throw new Error('Trip not found');
    }

    const alredyValuated = await this.valuationRepository.findValuationBy_User_Trip(user.email, trip.id);

    if(alredyValuated){
      this.logger.log('The user already valuated this trip');	
      throw new Error('The user already valuated this trip');
    }
    
    const input = new Valuation();
    input.trip = createValuationDto.tripId;
    input.puntaje = createValuationDto.puntaje;
    input.detalle = createValuationDto.detalle;
    input.user = user.email;

    const newValuation = await this.valuationRepository.createValuation(input);

    const tripResId = typeof trip.tripResumeId == "string" ? trip.tripResumeId : trip.tripResumeId.id;
 
    let tripResume = await this.tripResumeService.findById(tripResId);
     
    if(!tripResume){
      const TR= new TripResume();
      TR.passangers = [];
      TR.valuations = [newValuation.id]; 
      TR.tripId = trip.id;
      tripResume = await this.tripResumeService.createTripResume(TR);
    }
    trip.tripResumeId = tripResume.id;
    
    const tripUpdated = await this.tripService.update(trip);
    return newValuation;
   
    } catch (error) {
      this.logger.log('Error in create: ', error);
      throw error;
    }
  }

  async findAll(email: string): Promise<ResponseDTO> {
    let message = 'Valuations not found';

    try {
      const items = await this.valuationRepository.findAll();

      if (items.length == 0)
        return this.responseHelper.makeResponse(
          false,
          message,
          null,
          HttpStatus.NOT_FOUND,
        );

      message = 'Successfully found valuations';

      return this.responseHelper.makeResponse(
        false,
        message,
        items,
        HttpStatus.OK,
      );

    } catch (error) {
      const message = 'Error in findAll: ' + error.message;
      this.logger.log(message);

      return this.responseHelper.makeResponse(
        true,
        message,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    let message = 'Valuation not found';

    try {
      const valuation = await this.valuationRepository.findValuationById(id);

      if (!valuation)
        return this.responseHelper.makeResponse(
          false,
          message,
          null,
          HttpStatus.NOT_FOUND,
        );

      message = 'Valuation Successfully founded ';

      return this.responseHelper.makeResponse(
        false,
        message,
        valuation,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.log('Error in findById: ', error);

      return this.responseHelper.makeResponse(
        true,
        message,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMyValuations(email: string): Promise<ResponseDTO> {
    let message = 'Valuations not found';
    try {
      const user = await this.userService.findByEmail(email);

      if (!user)
        return this.responseHelper.makeResponse(
          false,
          'User not found',
          null,
          HttpStatus.NOT_FOUND,
        );

      const valuations = await this.valuationRepository.findValuationsByEmail(user.email);

      if (valuations.length == 0)
        return this.responseHelper.makeResponse(
          false,
          message,
          null,
          HttpStatus.NOT_FOUND,
        );

      message = 'Successfully found valuations';

      return this.responseHelper.makeResponse(
        false,
        message,
        valuations,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.log('Error in findMyValuations: ', error);

      return this.responseHelper.makeResponse(
        true,
        message,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(updateValuationDto: UpdateValuationDto): Promise<ResponseDTO> {
    try {
      const valuation =  new Valuation();
      valuation.user = updateValuationDto.email;
      valuation.trip = updateValuationDto.tripId;
      valuation.puntaje = updateValuationDto.puntaje;
      valuation.detalle = updateValuationDto.detalle;
      
      const hasValuation = await this.valuationRepository.updateValuation(
        updateValuationDto.id,
        valuation,
      ); //El DTO debe traer los valores no cambiados

      if (!hasValuation) {
        this.logger.log(
          `Not found valuation ${updateValuationDto.id} for user ${updateValuationDto}`,
        );
        return this.responseHelper.makeResponse(
          false,
          `Not found valuation ${updateValuationDto.id} for user ${updateValuationDto.email}`,
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.log(
        `The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`,
      );
      return this.responseHelper.makeResponse(
        false,
        `The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`,
        hasValuation,
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.log('Error in create: ', error);

      return this.responseHelper.makeResponse(
        true,
        'The valuation was not created',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<ResponseDTO> {
    try {
      let deletedValuation;
      deletedValuation = await this.valuationRepository.deleteValuation(id);
      if (!deletedValuation) {
        this.logger.log(`The valuation couldnt been founded ${id}`);
        return this.responseHelper.makeResponse(
          false,
          `Not deleted valuation ${id}`,
          null,
          HttpStatus.NOT_MODIFIED,
        );
      }

      try {
        const tripResume = await this.tripResumeService.findById(deletedValuation.tripId);
        const valuationsSet = new Set(tripResume.valuations.map(v => v.id?v.id:v));
        valuationsSet.delete(id);
        tripResume.valuations = Array.from(valuationsSet);
      } catch (error) {
        console.log('Error: %s', error.message);
        throw error;
      } 


      this.logger.log(
        `The valuation of the trip ${deletedValuation.tripId} for user ${deletedValuation.email} was deleted`,
      );
      return this.responseHelper.makeResponse(
        false,
        `The valuation of the trip ${deletedValuation.tripId} for user ${deletedValuation.email} was deleted`,
        deletedValuation,
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.log('Error in create: ', error);

      return this.responseHelper.makeResponse(
        true,
        'The valuation was not created',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
