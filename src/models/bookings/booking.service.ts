import { HttpStatus, Inject, Injectable, Logger, Res } from '@nestjs/common';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { StatusRequest } from './enums/status.enum';
import { IBOOKING_REPOSITORY } from './repository/constants/booking.repository.constant';
import { IBookingRepository } from './interface/booking.repository.interface';
import { Booking } from './booking.schema';
@Injectable()
export class BookingService {

  private readonly logger = new Logger(BookingService.name);

  constructor(
    @Inject(IBOOKING_REPOSITORY) private readonly bookingRepository: IBookingRepository,
    private readonly responseHelper : ResponseHelper,
    ){}

  async findMyBookings_Controller(cuil: number): Promise<ResponseDTO> {
    try {

      const bookings = await this.bookingRepository.findMyBookingsByCuil(cuil);

      if(!bookings) return this.responseHelper.makeResponse(true,'Bookings not found.',null,HttpStatus.NOT_FOUND);

      return this.responseHelper.makeResponse(false,'Bookings found.',bookings,HttpStatus.OK);

    } catch (error) {
      this.logger.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,error.message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findRequestById(bookingId: string, userEmail:string ): Promise<ResponseDTO> {
    try {

      const booking = await this.bookingRepository.findById(bookingId);

      if(!booking) return this.responseHelper.makeResponse(true,'Request not found.',null,HttpStatus.NOT_FOUND);

      if(booking.owner != userEmail){
        return this.responseHelper.makeResponse(true,'You can only see your own bookings.',null,HttpStatus.UNAUTHORIZED);
      }
      
      if(booking.status == StatusRequest.CANCELLED){
        return this.responseHelper.makeResponse(true,'Request was cancelled.',null,HttpStatus.UNPROCESSABLE_ENTITY);
      } //Juan deberíamos decirle este estado?

      const message = 'Request found succesfully.';
      const status = HttpStatus.OK;
      
      return this.responseHelper.makeResponse(false, message,booking,status);
    } catch (error) {
      this.logger.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update( booking: Booking): Promise<ResponseDTO> {
    try{
      booking = await this.bookingRepository.update(booking);
      if(!booking) return this.responseHelper.makeResponse(true,'Booking not found.',null,HttpStatus.NOT_FOUND);

      this.logger.log('Booking updated succesfully.');
      return this.responseHelper.makeResponse(false,'Booking updated succesfully.',booking,HttpStatus.OK);
    }
    catch(error){
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${BookingService.name}: error in update method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBooking_Controller(booking: Booking): Promise<ResponseDTO> {
    try {
      booking = await this.bookingRepository.create(booking);
      if(!booking) return this.responseHelper.makeResponse(true,'Booking not created.',null,HttpStatus.UNPROCESSABLE_ENTITY);

      this.logger.log('Booking created succesfully.');
      return this.responseHelper.makeResponse(false,'Booking created succesfully.',booking,HttpStatus.CREATED);
    } catch (error) {
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${BookingService.name}: error in create method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeBooking_Controller(bookingId: string): Promise<ResponseDTO> {
    try {
      const booking = await this.bookingRepository.remove(bookingId);

      if(!booking) return this.responseHelper.makeResponse(true,'Booking not found.',null,HttpStatus.NOT_FOUND);

      this.logger.log('Booking removed succesfully.');
      return this.responseHelper.makeResponse(false,'Booking removed succesfully.',null,HttpStatus.OK);
    } catch (error) {
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${BookingService.name}: error in remove method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeBookingStatus_Controller(bookingId: string, status: string): Promise<ResponseDTO> {
    try {
      const booking = await this.bookingRepository.setStatus(bookingId, status);

      if(!booking) return this.responseHelper.makeResponse(true,'Booking not found.',null,HttpStatus.NOT_FOUND);

      this.logger.log('Booking removed succesfully.');
      return this.responseHelper.makeResponse(false,'Booking removed succesfully.',null,HttpStatus.OK);
    } catch (error) {
      this.logger.error(error);
      return this.responseHelper.makeResponse(true,`${BookingService.name}: error in remove method.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllBooking_Controller()
  {
    try {
      
      const bookings = await this.bookingRepository.findAll();

  //TODO: Revidar TripId

      if(bookings.length === 0)
      {
        this.logger.log('Not found bookings with.')
        return this.responseHelper.makeResponse(false,`${BookingService.name}: Not found bookings.`,null,HttpStatus.NOT_FOUND);
      }

      this.logger.log('Init process to get bookings from trips...');

      this.logger.log(`Process finished. bookings: ${JSON.stringify(bookings)}`);

      // const responsebookings = bookings.flat();

      // responsebookings.sort(this.custom_sort);

      return this.responseHelper.makeResponse(false,`${BookingService.name}: bookings founded.`,bookings,HttpStatus.OK);

    } catch (error) {
      return this.responseHelper.makeResponse(true,`${BookingService.name}: error ${error.message}.`,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.create(booking);
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.update(booking);
  }

  async removeBooking(id: string): Promise<boolean> {
    return await this.bookingRepository.remove(id);
  }

  async setStatus(id: string, status: string): Promise<Booking> {
    return await this.bookingRepository.setStatus(id, status);
  }



}
