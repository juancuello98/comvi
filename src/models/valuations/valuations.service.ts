import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';

import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ResponseDTO } from '../../common/interfaces/responses.interface';

import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { Valuation, ValuationDocument } from './entities/valuation.schema';
import { IVALUATION_REPOSITORY } from './repository/constants/valuations.repository.constant';
import { IValuationRepository } from './interfaces/valuations.repository.interface';
import { ITRIP_REPOSITORY } from '@/trips/repository/constants/trip.repository.constant';
import { ITripRepository } from '@/trips/interface/trip.repository.interface';
import { IUserRepository } from '@/users/interfaces/user.repository.interface';
import { IUSER_REPOSITORY } from '@/users/repository/constants/user.repository.constant';
import { Trip} from '@/trips/trip.schema';
import { TripResume } from '@/trips/resumes/trip.resume.schema'; 
import { ITRIP_RESUME_REPOSITORY } from '@/trips/resumes/repository/constants/trip.resume.repository.constant';
import { ITripResumeRepository } from '@/trips/resumes/interface/trip.repository.interface';

@Injectable()
export class ValuationsService {
  private readonly logger = new Logger(ValuationsService.name);

  constructor(
    @Inject(IVALUATION_REPOSITORY) private readonly valuationRepository: IValuationRepository,
    @Inject(ITRIP_REPOSITORY) private readonly tripRepository: ITripRepository,
    @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ITRIP_RESUME_REPOSITORY) private readonly tripResumeRepository: ITripResumeRepository,

    private readonly responseHelper: ResponseHelper,
  ) {}

  async create(createValuationDto: CreateValuationDto) {
    try{
    const user = await this.userRepository.findByEmail(createValuationDto.email);
    const trip = await this.tripRepository.findById(createValuationDto.tripId);

    if(!user){
      this.logger.log('User not found');	
      return this.responseHelper.makeResponse(true, 'User not found', null, HttpStatus.NOT_FOUND);
    }
    if(!trip){
      this.logger.log('Trip not found');	
      return this.responseHelper.makeResponse(true, 'Trip not found', null, HttpStatus.NOT_FOUND);
    }

    const alredyValuated = await this.valuationRepository.findValuationBy_User_Trip(user.id, trip.id);

    if(alredyValuated){
      this.logger.log('The user already valuated this trip');	
      return this.responseHelper.makeResponse(true, 'The user already valuated this trip', null, HttpStatus.CONFLICT);
    }
    
    
    // if (trip.status != 'FINISHED') {
    //   this.logger.log('The trip is not finished yet');	
    //   return this.responseHelper.makeResponse(true, 'The trip is not finished yet', null, HttpStatus.CONFLICT);
    // }

    //to do: chequear flujo de valuaciones cuuando si y cuanod no se puede hacer una.


    const input = new Valuation();
    input.email = createValuationDto.email;
    input.tripId = createValuationDto.tripId;
    input.puntaje = createValuationDto.puntaje;
    input.detalle = createValuationDto.detalle;
    input.userId = user._id;

    const ValSession = await this.valuationRepository.getSession();
    const TripSession = await this.tripRepository.getSession();
    const TripResumeSession = await this.tripResumeRepository.getSession();
    let tripResume = await this.tripResumeRepository.findById(trip.resumeId);
    try {
      ValSession.startTransaction();
      TripSession.startTransaction();
      TripResumeSession.startTransaction();
      if(!tripResume){
          const newValuation = await this.valuationRepository.createValuation(input);
          const TR= new TripResume();
          TR.passengers = trip.id;
          TR.valuations = [newValuation.id]; 
          TR.tripId = trip.id;
          tripResume = await this.tripResumeRepository.create(TR);
          trip.resumeId = tripResume.id;
          // await tripResume.save({ session: TripResumeSession});
          // await newValuation.save({ session: ValSession });
          await trip.save({ session: TripSession}); 
          await ValSession.commitTransaction();
          await TripSession.commitTransaction();
          await TripResumeSession.commitTransaction();
      }
      else{
        const newValuation = await this.valuationRepository.createValuation(input);
        trip.resumeId = tripResume.id; // por las moscas
        await trip.save({ session: TripSession });
        tripResume.valuations.push(newValuation.id);
        await ValSession.commitTransaction();
        await TripSession.commitTransaction();
        await TripResumeSession.commitTransaction();
      }
      ValSession.endSession();
      TripSession.endSession();
      TripResumeSession.endSession();
      
    } catch (error) {
      console.log('Error: %s', error.message);
      TripSession.abortTransaction();
      ValSession.abortTransaction();
      TripResumeSession.abortTransaction();
      ValSession.endSession();
      TripResumeSession.endSession();
      TripSession.endSession();
      throw error;
    }

   
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
      const user = await this.userRepository.findByEmail(email);

      if (!user)
        return this.responseHelper.makeResponse(
          false,
          'User not found',
          null,
          HttpStatus.NOT_FOUND,
        );

      const valuations = await this.valuationRepository.findValuationsByUserId(user.id);

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
      valuation.email = updateValuationDto.email;
      valuation.tripId = updateValuationDto.tripId;
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
      let ValSession; 
      let TripRSession; 
      let deletedValuation;
      try {
        ValSession = await this.valuationRepository.getSession();
        TripRSession = await this.tripResumeRepository.getSession();
        deletedValuation = await this.valuationRepository.deleteValuation(id);
        const tripResume = await this.tripResumeRepository.findById(deletedValuation.tripId);
        const valuationsSet = new Set(tripResume.valuations);
        valuationsSet.delete(id);
        tripResume.valuations = Array.from(valuationsSet);
        await tripResume.save({ session: TripRSession });
        await ValSession.commitTransaction();
        await TripRSession.commitTransaction();
      } catch (error) {
        console.log('Error: %s', error.message);
        await ValSession.abortTransaction();
        await TripRSession.abortTransaction();
        throw error;
      } finally {
        await ValSession.endSession();
        await TripRSession.endSession();
      }

      if (!deletedValuation) {
        this.logger.log(`The valuation couldnt ben erased ${id}`);
        return this.responseHelper.makeResponse(
          false,
          `Not deleted valuation ${id}`,
          null,
          HttpStatus.NOT_MODIFIED,
        );
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
