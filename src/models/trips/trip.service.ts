import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { Trip } from './trip.schema';
import { TripStatus } from './enums/state.enum';
import { NewTripDTO } from './dto/new-trip.dto';
import { ITripRepository } from './interface/trip.repository.interface';
import { ITRIP_REPOSITORY } from './repository/constants/trip.repository.constant';
import { ResponseHelper } from '@/common/helpers/http/response.helper';
import { LocationService } from '../locations/location.service';
import { Location } from '@/locations/location-schema';
import { VehiclesService } from '@/vehicles/vehicles.service';
import { UserService } from '@/users/user.service';
import { TripResumeService } from './resumes/tripResume.service';
// import { NotificationsService } from '../../notifications/notifications.service';
import { Product } from '../fuels/schemas/ProductSchemas';
import { FuelService } from '../fuels/fuels.service';
import { ExistingtTripDTO } from './dto/existing-trip.dto';
import { User } from '@/users/user.schema';
import { TravellingService } from 'src/travelling/travelling.service';
import { distance } from '@turf/turf';
import { ObjectId } from 'mongodb';
import { compare } from 'bcrypt';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tripResumeService: TripResumeService,
    @Inject(ITRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    private readonly vehicleService: VehiclesService,
    private readonly responseHelper: ResponseHelper,
    private readonly locationService: LocationService,
    // private readonly fuelsService: FuelService,
    private readonly travellingService: TravellingService,
    // private readonly notificationsService: NotificationsService,
  ) { }
  

  canHaveValuations(trip: Trip): boolean {
    return trip.status === TripStatus.FINISHED;
  }

  async findByDriver(driver: string): Promise<Trip[]> {
    const trips = await this.tripRepository.findByDriver(driver);

    if (!trips.length) {
      this.logger.log(`Trips of user ${driver} not founded.`);
      throw new Error('Not found trips.');
    }

    return trips;

  }

  async findByDriverController(driver: string): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findByDriver(driver);

    if (!trips.length) {
      this.logger.log(`Trips of user ${driver} not founded.`);
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.log(`Trips of user ${driver} founded.`);

    return this.responseHelper.makeResponse(
      false,
      'Trip founded.',
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

  async findAll(): Promise<ResponseDTO> {
    const trips = await this.tripRepository.findAll();
    if (!trips.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips founded.',
      trips,
      HttpStatus.OK,
    );
  }

  async findNonDriverTrips(email: string): Promise<ResponseDTO> {
    const items = await this.tripRepository.findNonDriverTrips(email);
    if (!items.length)
      return this.responseHelper.makeResponse(
        false,
        'Not found trips.',
        null,
        HttpStatus.NOT_FOUND,
      );

    return this.responseHelper.makeResponse(
      false,
      'Trips founded.',
      items,
      HttpStatus.OK,
    );
  }

  async findByIdController(tripId: string): Promise<ResponseDTO> {
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

      return this.responseHelper.makeResponse(false, message,trip, status);
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in findById',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(tripId: string): Promise<Trip> {
    try {
      let message = 'Successfully found trips';
      let status = HttpStatus.OK;

      let trip = await this.tripRepository.findById(tripId);

      if (!trip) {
        this.logger.error('Not found trips');
        throw new Error('Not found trips');
      }

      return trip;
    
    } catch (error) {
      this.logger.error('Error: ', error);
      throw error;
    }
  }

  async create(trip: NewTripDTO): Promise<{ trip: Trip, rutaConEstaciones: any }> {
    try {
      let response;
      let message = 'Trip was created succesfully.';
      let driver = (await this.userService.findByEmail(trip.driver));
      let origin = (await this.locationService.create((trip.origin as Location)));
      let destination = (await this.locationService.create(trip.destination as Location));
      let vehicle = (await this.vehicleService.findByPatent(trip.vehicle));
      if (!driver )
      {
        this.logger.log('Driver not found');
        throw new Error('Driver not found');
        return null;
      }
      if (!origin )
      {
        this.logger.log('Origin not found');
        throw new Error('Origin not found');
        return null;
      }
      if (!destination )
      {
        this.logger.log('Destination not found');
        throw new Error('Destination not found');
        return null;
      }
      if (trip.peopleQuantity < 1)
      {
        this.logger.log('People quantity must be greater than 0');
        throw new Error('People quantity must be greater than 0');
        return null;
      }
      if (trip.allowPassenger === false && trip.allowPackage === false)
        {
          this.logger.log('Trip must allow passengers or packages');
          throw new Error('Trip must allow passengers or packages');
          return null;
        }
      if (!vehicle)
      {
        this.logger.log('Vehicle not found');
        throw new Error('Vehicle not found');
        return null;
      }

      let newTrip;
      

        newTrip = new Trip();
        
   
        const status = TripStatus.OPEN;
        const placesAvailable = trip.peopleQuantity;
       
        newTrip.origin = origin;
        newTrip.destination = destination;
        newTrip.description = trip.description;
        newTrip.allowPackage = trip.allowPackage;
        newTrip.allowPassenger = trip.allowPassenger;
        newTrip.peopleQuantity = trip.peopleQuantity;
        newTrip.placesAvailable = placesAvailable;
        newTrip.driver = trip.driver;
        newTrip.vehicle = trip.vehicle;
        newTrip.tripResumeId = null;
        newTrip.status = status;
        const result = await this.travellingService.calcularRutaConEstaciones({lat: parseFloat(origin.latitude), lng: parseFloat(origin.longitude)}, {lat: parseFloat(destination.latitude), lng: parseFloat(destination.longitude)}, vehicle.consumption, vehicle.getFuelsString(), 5);
        newTrip.route = result.ruta.id;// result.tripRoute.id;
        newTrip.kilometers = result.ruta.distance;
                // Inicialización de `bookings` como un array vacío, si se espera un array de strings o IDs
                newTrip.bookings = []; // Cambia a `MongooseSchema.Types.ObjectId[]` si necesitas que almacene IDs de `Booking`
        
                // Otros campos opcionales
                newTrip.packages = [];
                // newTrip.estimatedCosts = ;
                // newTrip.kilometers = trip.kilometers || 0;
                newTrip.tripsRequests = [];
        const tripCreated = await this.tripRepository.create(newTrip);

      return {trip:tripCreated, rutaConEstaciones:result};

    } catch (error) {
      this.logger.error('Error in create: ', error.message);
      throw error;
    }
  }

  async getTripCost(TripID: string): Promise<any> {
    console.log('TripID:', TripID);
    // const id = new ObjectId(TripID);
    // console.log('ID:', id);
    const trip = await this.tripRepository.findById(TripID);
    console.log('Trip:', trip);
    let vehicle = trip.getVehicle();
    console.log('Vehicle: ', vehicle);
    if(!vehicle) vehicle = await this.vehicleService.findByPatent(trip.vehicle);
    console.log('Vehicle: ', vehicle);
    // const fuels = vehicle.fuels.map(fuel => {
    //   if (typeof(fuel) === 'string') return fuel; 
    //   else return (fuel as Product).idproducto;
    // });
    console.log(vehicle.getFuelsString())
    await this.travellingService.calcularRutaConEstaciones({lat: parseFloat(trip.origin.latitude), lng: parseFloat(trip.origin.longitude)}, {lat: parseFloat(trip.destination.latitude), lng: parseFloat(trip.destination.longitude)}, vehicle.consumption, vehicle.getFuelsString(), 5);    }
    
  async createToController(trip: NewTripDTO): Promise<ResponseDTO> {
    try {
      let response;
      let message = 'Trip was created succesfully.';
      let driver = (await this.userService.findByEmail(trip.driver));
      let origin = (await this.locationService.create((trip.origin as Location)));
      let destination = (await this.locationService.create(trip.destination as Location));
      let vehicle = (await this.vehicleService.findByPatent(trip.vehicle));
      if (!driver )
      {
        return this.responseHelper.makeResponse(
          false,
          'Driver not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!origin )
      {
        return this.responseHelper.makeResponse(
          false,
          'Origin not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!destination )
      {
        return this.responseHelper.makeResponse(
          false,
          'Destination not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      if (trip.peopleQuantity < 1)
      {
        return this.responseHelper.makeResponse(
          false,
          'People quantity must be greater than 0',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (trip.peopleQuantity < 1)
        {
          return this.responseHelper.makeResponse(
            false,
            'People quantity must be greater than 0',
            null,
            HttpStatus.BAD_REQUEST,
          );
        }
      if (trip.allowPassenger === false && trip.allowPackage === false)
        {
          return this.responseHelper.makeResponse(
            false,
            'Trip must allow passengers or packages',
            null,
            HttpStatus.BAD_REQUEST,
          );
        }
      if (!vehicle)
      {
        return this.responseHelper.makeResponse(
          false,
          'Vehicle not found',
          null,
          HttpStatus.NOT_FOUND,
        );
      }
      if(response) return response;

      let newTrip;
      

        newTrip = new Trip();
        const status = TripStatus.OPEN;
        const placesAvailable = trip.peopleQuantity;

        // Asignar valores a las propiedades requeridas

        newTrip.origin = origin; // Asegúrate de que `origin.id` sea un ObjectId válido
        newTrip.destination = destination; // Asegúrate de que `destination.id` sea un ObjectId válido
        newTrip.description = trip.description || ''; // Descripción del viaje, asegurándose de que no esté vacío
        newTrip.allowPackage = trip.allowPackage;
        newTrip.allowPassenger = trip.allowPassenger;
        newTrip.peopleQuantity = trip.peopleQuantity;
        newTrip.placesAvailable = trip.peopleQuantity; // O el valor adecuado
        newTrip.driver = trip.driver; // ID del conductor (asegúrate de que sea un ObjectId válido)
        // newTrip.driverEmail = driver.email; // Correo electrónico del conductor
        newTrip.status = TripStatus.OPEN;
        newTrip.vehicle = trip.vehicle ; // ID del vehículo (asegúrate de que sea un ObjectId válido)
        newTrip.tripResumeId = null; // Si es opcional, puede estar en null
        newTrip.status = status;
        // const result = await this.travellingService.calcularRutaConEstaciones({lat: parseFloat(origin.latitude), lng: parseFloat(origin.longitude)}, {lat: parseFloat(destination.latitude), lng: parseFloat(destination.longitude)}, vehicle.consumption, vehicle.getFuelsString(), 5);
        // console.log('Result:', result);
        newTrip.kilometers = 0;
        newTrip.route = 0; //result.tripRoute
        
        // Inicialización de `bookings` como un array vacío, si se espera un array de strings o IDs
        newTrip.bookings = []; // Cambia a `MongooseSchema.Types.ObjectId[]` si necesitas que almacene IDs de `Booking`
        
        // Otros campos opcionales
        newTrip.packages = [];
        // newTrip.estimatedCosts = ;
        // newTrip.kilometers = trip.kilometers || 0;
        newTrip.tripsRequests = [];
        const tripCreated = await this.tripRepository.create(newTrip);

      return this.responseHelper.makeResponse(
        false,
        message,
        // {...tripCreated, result},
        tripCreated,
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.responseHelper.makeResponse(
        false,
        "Error in create trip",
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

      // for (let i = 0; i < trip.bookings.length; i++) {
      //   //send notification to passengers)
      // }
    
      return this.responseHelper.makeResponse(false,'Trip was cancelled.',null,HttpStatus.OK)
  }

  async init(id: string, driver: string): Promise<ResponseDTO> { //TODO: Refactorizar esto
    const date = new Date().toISOString();
    const trip = await this.tripRepository.find({driver, _id: id})[0];

    if (!trip) {
      return this.responseHelper.makeResponse(
        false,
        `Not found trip ${id} for user ${driver}.`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    
    if (
      trip.status !== TripStatus.OPEN || trip.bookings.length
    ) {
      return this.responseHelper.makeResponse(
        false,
        `Incorrect trip status ${trip.status} or not contain bookings or packages.`,
        null,
        HttpStatus.OK,
      );
    }

    trip.status = TripStatus.IN_PROGRESS;
    trip.startedTimestamp = date;

    const updated = await this.tripRepository.update(trip);

    this.logger.log(`Trip updated with status ${updated.status}`);

    // for (let i = 0; i < trip.bookings.length; i++) {
    //     this.notificationsService.sendNotification(trip.bookings[i].passengers, {title:'Trip started', body: `Trip ${trip.id} started`});  
    //   }

    return this.responseHelper.makeResponse(
      false,
      `Trip successfully initialize : ${id}`,
      trip,
      HttpStatus.OK,
    );
  }

  async finish(id: string, driver: string): Promise<ResponseDTO> {
    this.logger.log('Initialize process to finish trip...');


    const trip = await this.tripRepository.findById(id);

    if (driver !== trip.driver){
      return this.responseHelper.makeResponse(
        false,
        `Driver not match with trip driver.`,
        null,
        HttpStatus.FORBIDDEN
      );
    }
    
    if (!trip || trip.status !== TripStatus.IN_PROGRESS)
    {
      return this.responseHelper.makeResponse(
        false,
        `Not found trip or status not is IN PROGRESS.`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    trip.status = TripStatus.FINISHED;

    const status = (await this.tripRepository.update(trip)).status;

    this.logger.log(`Trip status updated to ${status}`);

    let tripResumeId;;

    if (typeof(trip.tripResumeId) === 'string') {
        tripResumeId = trip.tripResumeId;
    } 
    else {
        tripResumeId = trip.tripResumeId.id;
    } 

    const resume = await this.tripResumeService.findById(tripResumeId);
    const resumeId = resume.id;

    this.logger.log(`Trip resume ${resumeId} updated.`);

    // for (let i = 0; i < trip.bookings.length; i++) {
    //   this.notificationsService.sendNotification(trip.bookings[i].passengers, {title:'Trip ended', body: `Trip ${trip.id} started`});  
    // }

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
      if(!passengers) return this.responseHelper.makeResponse(
        false,
        'Not found passengers in the trip.',
        passengers,
        HttpStatus.NOT_FOUND,
      );
      return this.responseHelper.makeResponse(
        false,
        'Passengers founded by trip.',
        passengers,
        HttpStatus.OK,
      );
    } catch (error) {
      console.error('Error: ', error);
      return this.responseHelper.makeResponse(
        true,
        'Error in listWithPassengers.',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllDrivers(): Promise<User[]> {
    return this.tripRepository.getAllDrivers();
  }
}
