import {
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
import { ResponseHelper } from '@/common/helpers/http/response.helper';
import { ITRIP_RESUME_REPOSITORY } from './repository/constants/trip.resume.repository.constant';
import { ITripResumeRepository } from './interface/trip.repository.interface';
import { TripResume } from './trip.resume.schema';
import { Trip } from '../trip.schema';
  
  @Injectable()
  export class TripResumeService {
    private readonly logger = new Logger(TripResumeService.name);
  
    constructor(
                
        @Inject(ITRIP_RESUME_REPOSITORY) private readonly tripResumeRepository: ITripResumeRepository,
        // private readonly responseHelper: ResponseHelper,
           
    ) {}

    async createTripResumeFromTrip(trip:Trip): Promise<TripResume> {
      try { 
        const tripRe = new TripResume();
        tripRe.tripId = trip.id;
        tripRe.passangers =[] ;
        tripRe.valuations = [];     
        const tripResume = await this.tripResumeRepository.create(tripRe);
        return tripResume;
      } catch (error) {
        this.logger.error(error.message);
        throw error
      }     

    }

    async createTripResume(tripRes:TripResume): Promise<TripResume> {
      try { 
        const tripResume = await this.tripResumeRepository.create(tripRes);
        return tripResume;
      } catch (error) {
        this.logger.error(error.message);
        throw error
      }     

    }
    
    async updateTripResume(tripRes: TripResume): Promise<TripResume> {
      try { 
        const tripResUp = await this.tripResumeRepository.update(tripRes);
        if (!tripResUp) {
            this.logger.error('Trip resume not found');
            throw new NotFoundException(`Trip resume with ID ${tripRes.id} not found`);
            return null;
        }
        return tripResUp;
      } catch (error) {
        this.logger.error(error.message);
        throw error;}     

    }

    async findByIdController(id: string): Promise<TripResume> {
        try {
            const tripResume = await this.tripResumeRepository.findById(id);
            if (!tripResume) {
            this.logger.error('Trip resume not found');
            return tripResume;
            }
        } catch (error) {
            this.logger.error(error.message);
            throw error;
          }
        }

    async findById(id: string): Promise<TripResume> {
          try {
              const tripResume = await this.tripResumeRepository.findById(id);
              if (!tripResume) {
                this.logger.error('Trip resume not found');
                throw new NotFoundException(`Trip resume with ID ${id} not found`);
              }
              return tripResume;
          } catch (error) {
              this.logger.error(error.message);
              throw error;
            }
          }
}
  