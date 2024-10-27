import {
    HttpStatus,
    Inject,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { v4 as uuidv4 } from 'uuid';
  import { ResponseHelper } from '@/common/helpers/http/response.helper';

  import { VehiclesService } from '@/vehicles/vehicles.service';
  import { UserService } from '@/users/user.service';
import { ITRIP_RESUME_REPOSITORY } from './constants/trip.resume.repository.constant';
import { ITripResumeRepository } from './interface/trip.repository.interface';
import { TripService } from '../trip.service';
import { TripResume } from './trip.resume.schema';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
  
  @Injectable()
  export class TripResumeService {
    private readonly logger = new Logger(TripResumeService.name);
  
    constructor(
                
        @Inject(ITRIP_RESUME_REPOSITORY)
        private readonly tripResumeRepository: ITripResumeRepository,
        private readonly tripService: TripService,
        private readonly responseHelper: ResponseHelper,
           
    ) {}

    async createTripResume(tripId: string): Promise<ResponseDTO> {
      try { 
        const resp = await this.tripService.findById(tripId);
        if (!resp) {
            this.logger.error('Trip not found');     
            return null;
        }
        const trip = resp.data;
        const tripRe = new TripResume();
        tripRe.tripId = trip.id;
        tripRe.passangers =[] ;
        tripRe.valuations = [];     
        const tripResume = await this.tripResumeRepository.create(tripRe);
        return this.responseHelper.makeResponse(false, 'Trip resume created successfully', tripResume, HttpStatus.CREATED);
      } catch (error) {
        this.logger.error(error.message);
        return this.responseHelper.makeResponse(true, 'Error creating trip resume', null, HttpStatus.INTERNAL_SERVER_ERROR);
      }     

    }

    async findById(id: string): Promise<ResponseDTO> {
        try {
            const tripResume = await this.tripResumeRepository.findById(id);
            if (!tripResume) {
            this.logger.error('Trip resume not found');
            return this.responseHelper.makeResponse(true, 'Trip resume not found', null, HttpStatus.NOT_FOUND);
            }
            return this.responseHelper.makeResponse(false, 'Trip resume found', tripResume, HttpStatus.OK);
        } catch (error) {
            this.logger.error(error.message);
            return this.responseHelper.makeResponse(true, 'Error finding trip resume', null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        }

    
   
}
  