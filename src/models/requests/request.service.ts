import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { Request, RequestDocument } from './request.schema';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { StatusRequest } from './enums/status.enum';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { MailService } from 'src/mail/config.service';
import { UserService } from '../users/user.service';
import { TripService } from '../trips/trip.service';

import { Location, LocationDocument } from '../locations/location-schema';

@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name);

  constructor(
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>,
    private mailService: MailService,
    private userService: UserService,
    private tripService: TripService,
    private readonly responseHelper : ResponseHelper
  ){}

  async send(req: ExtendedRequestDTO): Promise<ResponseDTO> {
    try {
      this.logger.log(`Processing request from ${req.email} for trip ${req.tripId}`);

      const trip = await this.tripModel.findOne({ id: req.tripId }).exec();
      
      if (!trip) {
        return this.responseHelper.makeResponse(
          true,
          'Trip not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      if (trip.driver === req.email) {
        return this.responseHelper.makeResponse(
          true,
          'You cannot request to join your own trip',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const partnerQuantity = req.partnerQuantity || 0;
      const totalPassengers = 1 + partnerQuantity;

      if (totalPassengers > trip.placesAvailable) {
        return this.responseHelper.makeResponse(
          true,
          `Not enough places available. You requested ${totalPassengers} places but only ${trip.placesAvailable} are available`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingRequest = await this.requestModel.findOne({
        email: req.email,
        tripId: req.tripId,
        status: { $in: [StatusRequest.ON_HOLD, StatusRequest.ACCEPTED] }
      }).exec();

      if (existingRequest) {
        return this.responseHelper.makeResponse(
          true,
          'You already have a pending or accepted request for this trip',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newRequest = new this.requestModel({
        email: req.email,
        tripId: req.tripId,
        description: req.description,
        hasEquipment: req.hasEquipment,
        hasPartner: req.hasPartner,
        partnerQuantity: partnerQuantity,
        totalPassenger: totalPassengers,
        createdTimestamp: new Date().toISOString(),
        status: StatusRequest.ON_HOLD
      });

      const requestCreated = await newRequest.save();

      this.logger.log(`Request created successfully with ID: ${requestCreated._id}`);

      // Enviar email de notificación al conductor
      try {
        const passenger = await this.userModel.findOne({ email: req.email }).exec();
        const driver = await this.userModel.findOne({ email: trip.driver }).exec();
        const origin = await this.locationModel.findById(trip.origin).exec();
        const destination = await this.locationModel.findById(trip.destination).exec();

        if (passenger && driver && origin && destination) {
          await this.mailService.sendNewRequestNotification(
            trip.driver,
            driver.name,
            `${passenger.name} ${passenger.lastname}`,
            origin.locality || origin.format_address,
            destination.locality || destination.format_address,
            trip.startedTimestamp || ''
          );
          this.logger.log(`New request notification sent to driver ${trip.driver}`);
        }
      } catch (emailError) {
        this.logger.error(`Error sending new request notification: ${emailError.message}`);
        // No fallamos la operación por error de email
      }

      return this.responseHelper.makeResponse(
        false,
        'Request sent successfully',
        requestCreated,
        HttpStatus.CREATED,
      );

    } catch (error) {
      this.logger.error(`Error in send method: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error creating request',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMyRequests(email: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Finding requests for user: ${email}`);

      const items = await this.requestModel
        .find({ email: email })
        .sort({ createdTimestamp: 'desc' })
        .exec();

      if (items.length === 0) {
        return this.responseHelper.makeResponse(
          false,
          'No requests found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const itemsWrapped = await Promise.all(
        items.map(async (request) => {
          const trip = await this.tripModel.findOne({ id: request.tripId }).exec();
          
          if (trip) {
            const origin = await this.locationModel.findById(trip.origin).exec();
            const destination = await this.locationModel.findById(trip.destination).exec();
            const driver = await this.userModel.findOne({ email: trip.driver }).exec();
            
            const tripWithPopulatedData = {
              ...trip.toObject(),
              origin: origin,
              destination: destination
            };
            
            const { email, ...requestWithoutEmail } = request.toObject();
            
            return {
              ...requestWithoutEmail,
              trip: tripWithPopulatedData,
              driver: {
                name: driver?.name,
                lastname: driver?.lastname,
                email: driver?.email
              }
            };
          }
          
          const { email, ...requestWithoutEmail } = request.toObject();
          return {
            ...requestWithoutEmail,
            trip: trip,
            driver: null
          };
        })
      );

      return this.responseHelper.makeResponse(
        false,
        'Requests found successfully',
        itemsWrapped,
        HttpStatus.OK,
      );

    } catch (error) {
      this.logger.error(`Error in findMyRequests: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error retrieving requests',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addTripToRequest(request: RequestDocument) {
    const trip = await this.tripModel.findOne({ id: request.tripId }).exec();
    return {
      ...request.toObject(),
      trip: trip
    };
  }

  async acceptRequest(requestId: string, driverEmail: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Accepting request ${requestId} by driver ${driverEmail}`);

      const request = await this.requestModel.findById(requestId).exec();
      if (!request) {
        return this.responseHelper.makeResponse(
          true,
          'Request not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const trip = await this.tripModel.findOne({ id: request.tripId }).exec();
      if (!trip) {
        return this.responseHelper.makeResponse(
          true,
          'Trip not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      if (trip.driver !== driverEmail) {
        return this.responseHelper.makeResponse(
          true,
          'You can only accept requests for your own trips',
          null,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (request.status === StatusRequest.CANCELLED) {
        return this.responseHelper.makeResponse(
          true,
          'Cannot accept a cancelled request',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (request.status === StatusRequest.ACCEPTED) {
        return this.responseHelper.makeResponse(
          false,
          'Request is already accepted',
          null,
          HttpStatus.OK,
        );
      }

      const totalPassengers = request.totalPassenger;
      if (totalPassengers > trip.placesAvailable) {
        return this.responseHelper.makeResponse(
          true,
          `Not enough places available. Request requires ${totalPassengers} places but only ${trip.placesAvailable} are available`,
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      const updateResult = await this.tripModel.updateOne(
        { id: request.tripId },
        { 
          $inc: { placesAvailable: -totalPassengers },
          $push: { acceptedRequests: request._id }
        }
      ).exec();
      
      if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update trip');
      }

      request.status = StatusRequest.ACCEPTED;
      await request.save();

      this.logger.log(`Request ${requestId} accepted successfully`);

      // Enviar email de notificación al pasajero
      try {
        const passenger = await this.userModel.findOne({ email: request.email }).exec();
        const driver = await this.userModel.findOne({ email: driverEmail }).exec();
        const origin = await this.locationModel.findById(trip.origin).exec();
        const destination = await this.locationModel.findById(trip.destination).exec();

        if (passenger && driver && origin && destination) {
          await this.mailService.sendAcceptedRequestNotification(
            request.email,
            passenger.name,
            `${driver.name} ${driver.lastname}`,
            origin.locality || origin.format_address,
            destination.locality || destination.format_address,
            trip.description || ''
          );
          this.logger.log(`Acceptance email sent to ${request.email}`);
        }
      } catch (emailError) {
        this.logger.error(`Error sending acceptance email: ${emailError.message}`);
        // No fallamos la operación por error de email
      }

      return this.responseHelper.makeResponse(
        false,
        'Request accepted successfully',
        null,
        HttpStatus.OK,
      );

    } catch (error) {
      this.logger.error(`Error in acceptRequest: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error accepting request',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rejectRequest(requestId: string, driverEmail: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Rejecting request ${requestId} by driver ${driverEmail}`);

      const request = await this.requestModel.findById(requestId).exec();
      if (!request) {
        return this.responseHelper.makeResponse(
          true,
          'Request not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const trip = await this.tripModel.findOne({ id: request.tripId }).exec();
      if (!trip) {
        return this.responseHelper.makeResponse(
          true,
          'Trip not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      if (trip.driver !== driverEmail) {
        return this.responseHelper.makeResponse(
          true,
          'You can only reject requests for your own trips',
          null,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (request.status === StatusRequest.CANCELLED) {
        return this.responseHelper.makeResponse(
          true,
          'Cannot reject a cancelled request',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (request.status === StatusRequest.ACCEPTED) {
        if (!trip.acceptedRequests) {
          trip.acceptedRequests = [];
        }
        trip.acceptedRequests = trip.acceptedRequests.filter(reqId => reqId.toString() !== request._id.toString());
        trip.placesAvailable += request.totalPassenger;
        await trip.save();
      }

      request.status = StatusRequest.REJECTED;
      await request.save();

      this.logger.log(`Request ${requestId} rejected successfully`);

      // Enviar email de notificación al pasajero
      try {
        const passenger = await this.userModel.findOne({ email: request.email }).exec();
        const driver = await this.userModel.findOne({ email: driverEmail }).exec();
        const origin = await this.locationModel.findById(trip.origin).exec();
        const destination = await this.locationModel.findById(trip.destination).exec();

        if (passenger && driver && origin && destination) {
          await this.mailService.sendRejectedRequestNotification(
            request.email,
            passenger.name,
            `${driver.name} ${driver.lastname}`,
            origin.locality || origin.format_address,
            destination.locality || destination.format_address,
            trip.description || ''
          );
          this.logger.log(`Rejection email sent to ${request.email}`);
        }
      } catch (emailError) {
        this.logger.error(`Error sending rejection email: ${emailError.message}`);
        // No fallamos la operación por error de email
      }

      return this.responseHelper.makeResponse(
        false,
        'Request rejected successfully',
        null,
        HttpStatus.OK,
      );

    } catch (error) {
      this.logger.error(`Error in rejectRequest: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error rejecting request',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelRequest(requestId: string, passengerEmail: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Cancelling request ${requestId} by passenger ${passengerEmail}`);

      const request = await this.requestModel.findById(requestId).exec();
      if (!request) {
        return this.responseHelper.makeResponse(
          true,
          'Request not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      if (request.email !== passengerEmail) {
        return this.responseHelper.makeResponse(
          true,
          'You can only cancel your own requests',
          null,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (request.status === StatusRequest.CANCELLED) {
        return this.responseHelper.makeResponse(
          true,
          'Request is already cancelled',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (request.status === StatusRequest.ACCEPTED) {
        const trip = await this.tripModel.findOne({ id: request.tripId }).exec();
        if (!trip) {
          return this.responseHelper.makeResponse(
            true,
            'Trip not found',
            null,
            HttpStatus.NOT_FOUND,
          );
        }

        if (trip.status !== 'OPEN') {
          return this.responseHelper.makeResponse(
            true,
            'Cannot cancel an accepted request because the trip has already started',
            null,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!trip.acceptedRequests) {
          trip.acceptedRequests = [];
        }
        trip.acceptedRequests = trip.acceptedRequests.filter(reqId => reqId.toString() !== request._id.toString());
        trip.placesAvailable += request.totalPassenger;
        await trip.save();
      }

      request.status = StatusRequest.CANCELLED;
      await request.save();

      this.logger.log(`Request ${requestId} cancelled successfully`);

      return this.responseHelper.makeResponse(
        false,
        'Request cancelled successfully',
        null,
        HttpStatus.OK,
      );

    } catch (error) {
      this.logger.error(`Error in cancelRequest: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error cancelling request',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRequestsForTrips(driverEmail: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Finding requests for trips of driver: ${driverEmail}`);

      const trips = await this.tripModel
        .find({ driver: driverEmail })
        .populate('origin', 'country province department locality format_address latitude longitude place_id')
        .populate('destination', 'country province department locality format_address latitude longitude place_id')
        .exec();
      
      if (!trips.length) {
        return this.responseHelper.makeResponse(
          false,
          'No trips found for this driver',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const tripIds = trips.map(trip => trip.id);
      const requests = await this.requestModel
        .find({ 
          tripId: { $in: tripIds },
          status: StatusRequest.ON_HOLD
        })
        .sort({ createdTimestamp: 'desc' })
        .exec();

      if (!requests.length) {
        return this.responseHelper.makeResponse(
          false,
          'No pending requests found for your trips',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const requestsWithTrips = await Promise.all(
        requests.map(async (request) => {
          const trip = trips.find(t => t.id === request.tripId);
          const user = await this.userModel.findOne({ email: request.email }).exec();
          const { email, ...requestWithoutEmail } = request.toObject();
          return {
            ...requestWithoutEmail,
            trip: trip,
            user: {
              name: user?.name,
              lastname: user?.lastname,
              email: user?.email
            }
          };
        })
      );

      return this.responseHelper.makeResponse(
        false,
        'Requests for your trips found successfully',
        requestsWithTrips,
        HttpStatus.OK,
      );

    } catch (error) {
      this.logger.error(`Error in getRequestsForTrips: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error retrieving requests for trips',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
