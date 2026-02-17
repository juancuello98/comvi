import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { Trip } from './trip.schema';
import { TripStatus } from './enums/state.enum';
import { TripResumeRepository } from './resumes/trip.resume.repository';
import { NewTripDTO } from './dto/new-trip.dto';
import { v4 as uuidv4 } from 'uuid';
import { ITripRepository } from './interface/trip.repository.interface';
import { ITRIP_REPOSITORY } from './repository/constants/trip.repository.constant';
import { ResponseHelper } from '@/common/helpers/http/response.helper';
import { LocationService } from '../locations/location.service';
import { Location } from '@/locations/location-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, RequestDocument } from '../requests/request.schema';
import { StatusRequest } from '../requests/enums/status.enum';
import { UserService } from '@/users/user.service';


@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @Inject(ITRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    private readonly tripResumeRepository: TripResumeRepository,
    private readonly responseHelper: ResponseHelper,
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,

  ) { }

  async find(field: Record<string, any>) : Promise<ResponseDTO> {
    const trips = await this.tripRepository.find(field);
    if (!trips.length) {
      return this.responseHelper.makeResponse(
        false,
        'No trips found.',
        [],
        HttpStatus.OK,
      );
    }
    return this.responseHelper.makeResponse(
      false,
      'Trips found successfully.',
      trips,
      HttpStatus.OK,
    );
  }

  async findByDriver(driver: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByDriver(driver);

    if (!trips.length) {
      return this.responseHelper.makeResponse(
        false,
        'No published trips found.',
        [],
        HttpStatus.OK,
      );
    }

    return this.responseHelper.makeResponse(
      false,
      'Published trips found successfully.',
      trips,
      HttpStatus.OK,
    );
  }

  async findByStatus(status: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.find({ status });
    if (!trips.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trip founded.',
      trips,
      HttpStatus.OK,
    );
  }

  async findNonDriverTrips(email: string): Promise<ResponseDTO> {
    const items = await this.tripRepository.findNonDriverTrips(email);
    if (!items.length)
      return this.responseHelper.makeResponse(
        false,
        'No trips available.',
        [],
        HttpStatus.OK,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips found successfully.',
      items,
      HttpStatus.OK,
    );
  }

  async findByPassenger(passengerEmail: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByPassenger(passengerEmail);
    
    if (!trips.length) {
      return this.responseHelper.makeResponse(
        false,
        'No trips found where you are a passenger.',
        [],
        HttpStatus.OK,
      );
    }

    return this.responseHelper.makeResponse(
      false,
      'Trips where you are a passenger found successfully.',
      trips,
      HttpStatus.OK,
    );
  }

  async findById(tripId: string): Promise<ResponseDTO> {
    try {
      let message = 'Successfully found trips';
      let status = HttpStatus.OK;

      let trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        trip = null;
        message = 'Not found trips';
        status = HttpStatus.NOT_FOUND;
        return this.responseHelper.makeResponse(false, message, {}, status);
      }

      const driver = await this.userService.findByEmail(trip.driver);
      const tripFounded = {...trip, driver}

      return this.responseHelper.makeResponse(false, message,tripFounded, status);
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in findById',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(trip: NewTripDTO): Promise<ResponseDTO> {
    try {
      const originLocation = await this.locationService.create((trip.origin as Location));
      const destinationLocation = await this.locationService.create(trip.destination as Location);
      const origin = (originLocation as any)._id;
      const destination = (destinationLocation as any)._id;
      const id = uuidv4();
      const status = TripStatus.OPEN;
      const placesAvailable = trip.peopleQuantity;
      const createdTimestamp = new Date().toISOString();
      const input = Object.assign(trip, { 
        id, 
        origin, 
        destination, 
        status, 
        placesAvailable, 
        createdTimestamp,
        acceptedRequests: [],
        tripsRequests: [],
        valuations: []
      });

      const newTrip = await this.tripRepository.create(input);
      const message = 'Trip was created succesfully.';
      return this.responseHelper.makeResponse(
        false,
        message,
        newTrip,
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.responseHelper.makeResponse(
        false,
        error.message,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(trip: Trip): Promise<Trip> {
    return this.tripRepository.update(trip);
  }

  async cancel(id: string): Promise<ResponseDTO> {
    const trip = await this.tripRepository.updateStatus(id, TripStatus.CANCELED);

    if (!trip || trip.status !== TripStatus.CANCELED)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip or update failed.`,
        null,
        HttpStatus.NOT_FOUND,
      );

    try {
      const allRequests = await this.requestModel.find({
        tripId: id,
        status: { $in: [StatusRequest.ON_HOLD, StatusRequest.ACCEPTED] }
      }).exec();

      if (allRequests.length > 0) {
        await this.requestModel.updateMany(
          { tripId: id, status: { $in: [StatusRequest.ON_HOLD, StatusRequest.ACCEPTED] } },
          { status: StatusRequest.REJECTED }
        ).exec();
      }
    } catch (error) {
      this.logger.error(`Error rejecting requests for trip ${id}: ${error.message}`);
    }
    
    return this.responseHelper.makeResponse(false,'Trip was cancelled.',null,HttpStatus.OK)
  }

  async init(id: string, driver: string): Promise<ResponseDTO> {
    const date = new Date().toISOString();
    const trip = await this.tripRepository.findByIdAndDriver(driver, id);

    if (!trip) {
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${driver}.`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    
    if (
      trip.status !== TripStatus.OPEN || !trip.acceptedRequests || trip.acceptedRequests.length === 0
    ) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status} or not contain accepted requests or packages.`,
        null,
        HttpStatus.OK,
      );
    }

    const resume = await this.tripResumeRepository.create({
      passengers: trip.acceptedRequests || [],
      startedTimestamp: date
    });

    //const resumeId = resume._id;

    //trip.tripResumeId = resumeId;
    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = date;

    const updated = await this.tripRepository.update(trip);

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async finish(id: string, driver: string): Promise<ResponseDTO> {
    const trip = await this.tripRepository.findByIdAndDriver(driver, id);

    if (!trip || trip.status !== TripStatus.IN_PROGRESS)
      return this.responseHelper.makeResponse(
        false,
        `Not found trip or status not is IN PROGRESS.`,
        null,
        HttpStatus.NOT_FOUND,
      );

    trip.status = TripStatus.FINISHED;

    const status = (await this.tripRepository.update(trip)).status;

    const resume = await this.tripResumeRepository.findById(trip.tripResumeId);
    resume.endedTimestamp = new Date().toISOString();
    const resumeId = (await this.tripResumeRepository.update(resume))._id;

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully finished : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async listOfPassengers(id: string): Promise<ResponseDTO> {
    try {
      const passengers = await this.tripRepository.passengersByTrip(id);
      
      if (!passengers || passengers.length === 0) {
        return this.responseHelper.makeResponse(
          false,
          'Not found passengers in the trip.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      
      return this.responseHelper.makeResponse(
        false,
        'Passengers founded by trip.',
        passengers,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error in listOfPassengers: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error retrieving passengers for the trip.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ============================================
  // BUSINESS LOGIC METHODS
  // ============================================

  /**
   * Buscar viajes cercanos a una ubicación por coordenadas
   */
  async findNearbyTrips(
    longitude: number,
    latitude: number,
    maxDistanceKm: number = 50
  ): Promise<ResponseDTO> {
    try {
      this.logger.log(`Searching trips near [${longitude}, ${latitude}] within ${maxDistanceKm}km`);

      const trips = await this.tripRepository.find({
        'origin.location': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistanceKm * 1000, // Convertir a metros
          },
        },
        status: TripStatus.OPEN,
        departureDate: { $gte: new Date() },
      });

      if (!trips.length) {
        return this.responseHelper.makeResponse(
          false,
          'No nearby trips found.',
          [],
          HttpStatus.OK,
        );
      }

      return this.responseHelper.makeResponse(
        false,
        `Found ${trips.length} nearby trips.`,
        trips,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error finding nearby trips: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error searching nearby trips.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Buscar viajes disponibles por ruta (provincia origen-destino)
   */
  async findAvailableByRoute(
    originProvince: string,
    destinationProvince: string,
    fromDate?: Date
  ): Promise<ResponseDTO> {
    try {
      this.logger.log(`Searching trips from ${originProvince} to ${destinationProvince}`);

      const query: any = {
        'origin.province': originProvince,
        'destination.province': destinationProvince,
        status: TripStatus.OPEN,
        placesAvailable: { $gt: 0 },
      };

      if (fromDate) {
        query.departureDate = { $gte: fromDate };
      }

      const trips = await this.tripRepository.find(query);

      if (!trips.length) {
        return this.responseHelper.makeResponse(
          false,
          'No available trips found for this route.',
          [],
          HttpStatus.OK,
        );
      }

      // Ordenar por fecha de salida
      trips.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());

      return this.responseHelper.makeResponse(
        false,
        `Found ${trips.length} available trips.`,
        trips,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error finding trips by route: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error searching trips by route.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Búsqueda full-text de viajes
   */
  async searchTrips(searchTerm: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Full-text search for: ${searchTerm}`);

      const trips = await this.tripRepository.find({
        $text: { $search: searchTerm },
        status: TripStatus.OPEN,
      });

      if (!trips.length) {
        return this.responseHelper.makeResponse(
          false,
          'No trips found matching your search.',
          [],
          HttpStatus.OK,
        );
      }

      return this.responseHelper.makeResponse(
        false,
        `Found ${trips.length} trips matching your search.`,
        trips,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error in full-text search: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error searching trips.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verificar si un viaje puede aceptar más pasajeros
   */
  canAcceptPassengers(trip: Trip, count: number = 1): boolean {
    return trip.placesAvailable >= count && trip.status === TripStatus.OPEN;
  }

  /**
   * Reservar asientos en un viaje
   */
  async reserveSeats(tripId: string, count: number = 1): Promise<ResponseDTO> {
    try {
      const trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        return this.responseHelper.makeResponse(
          false,
          'Trip not found.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!this.canAcceptPassengers(trip, count)) {
        return this.responseHelper.makeResponse(
          false,
          'No hay suficientes lugares disponibles o el viaje no está abierto.',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      trip.placesAvailable -= count;
      const updatedTrip = await this.tripRepository.update(trip);

      this.logger.log(`Reserved ${count} seat(s) in trip ${tripId}`);

      return this.responseHelper.makeResponse(
        false,
        `Successfully reserved ${count} seat(s).`,
        updatedTrip,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error reserving seats: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error reserving seats.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Liberar asientos de un viaje
   */
  async releaseSeats(tripId: string, count: number = 1): Promise<ResponseDTO> {
    try {
      const trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        return this.responseHelper.makeResponse(
          false,
          'Trip not found.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      trip.placesAvailable = Math.min(trip.placesAvailable + count, trip.peopleQuantity);
      const updatedTrip = await this.tripRepository.update(trip);

      this.logger.log(`Released ${count} seat(s) in trip ${tripId}`);

      return this.responseHelper.makeResponse(
        false,
        `Successfully released ${count} seat(s).`,
        updatedTrip,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error releasing seats: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error releasing seats.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calcular el porcentaje de ocupación de un viaje
   */
  calculateOccupancyPercentage(trip: Trip): number {
    if (trip.peopleQuantity === 0) return 0;
    const occupied = trip.peopleQuantity - trip.placesAvailable;
    return Math.round((occupied / trip.peopleQuantity) * 100);
  }

  /**
   * Verificar si un viaje está lleno
   */
  isTripFull(trip: Trip): boolean {
    return trip.placesAvailable === 0;
  }

  /**
   * Verificar si un viaje ya pasó su fecha de salida
   */
  isTripPast(trip: Trip): boolean {
    return trip.departureDate && new Date() > new Date(trip.departureDate);
  }

  /**
   * Obtener la ruta formateada del viaje
   */
  getTripRoute(trip: Trip): string {
    if (!trip.origin || !trip.destination) return '';
    return `${trip.origin.locality} → ${trip.destination.locality}`;
  }
}
