import { Injectable, Logger } from '@nestjs/common';
import { TripService } from 'src/models';

@Injectable()
export class StadisticsService {

    private readonly logger = new Logger(StadisticsService.name);

  constructor(
  private readonly tripService: TripService,
  ) {
    
  }

  async getDriver_VS_Passengers( ) {
    try {
        const drivers = await this.tripService.findAllDrivers();
        const passengers = await this.tripService.findAllDrivers();
        console.log('Notification sent successfully:', passengers);

    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

}
