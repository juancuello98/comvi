
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { NewTripDTO } from '../dto/new-trip.dto';
import { TripStatus } from '../enums/state.enum';
import { Trip, TripDocument } from '../trip.schema';
import { ITripRepository } from '../interface/trip.repository.interface';
import { User } from '@/users/user.schema';
import { driverView } from '@/users/repository/users.views';

export class TripMongodbRepository implements ITripRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
  ) {}

  async getAllDrivers(): Promise<User[]> {
    const trips = await this.tripModel.find().select('driver').populate({
      path: 'driver',
      localField: 'driver',
      foreignField: 'email',
      select: driverView,
    }).exec();

    const drivers = trips.map(trip => trip.getDriver());
    return drivers;
  }
   getTrip(obj: any): Trip {
    const trip = new Trip();
    Object.keys(trip).forEach(key => {
      if (obj[key] !== undefined) {
        trip[key] = obj[key];
      }
    });
    return trip;
  }

  async findByDriver(driverEmail: string): Promise<Trip[]> {
    const trips = await this.tripModel
      .find({ driverEmail })
      .sort({ createdTimestamp: 'desc' })
      .select('-__v -id')
      .populate({
        path: 'driver', 
        localField: 'driver',
        foreignField: 'email',
        select: driverView
    })
    .populate({
      path: 'vehicle', 
      localField: 'vehicle',
      foreignField: 'patentPlate',
      select: '-__v -id' 
      })
  
    .populate({
        path: 'passengers', 
        select: '-__v -id -password -status -verificationCode -resetPasswordToken'
    })
    .populate({
        path: 'origin', 
        select: '-__v -id' 
      }) 
      .populate({
        path: 'destination', 
        select: '-__v -id' 
      }) 
      .populate({
        path: 'bookings', 
        select: '-__v -id' 
      })
      .populate({
        path: 'tripRequests', 
        select: '-__v -id' 
      }) 
      .populate({
        path: 'tripResumeId', 
        select: '-__v -id',
        populate: [
            { 
                path: 'valuations', 
                select: '-__v -id' 
            },
            { 
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            }
        ]
    })
      .exec();
    const newTrips = trips.map(trip => this.getTrip(trip));

    return newTrips;
  }

  async find(field: any): Promise<Trip[]> {
    const trips =  await this.tripModel.find(field).select('-__v -id').exec();
    const result = trips.map(trip => this.getTrip(trip));
    return result;
  }

  async findByIdWithDriver(id: string): Promise<Trip> {
    const trip = await this.tripModel.findOne({id}).select('-__v -id') 
    .populate({
      path: 'driver', 
      localField: 'driver',
      foreignField: 'email',
      select: driverView , 
  })
  .populate({
    path: 'vehicle', 
    localField: 'vehicle',
    foreignField: 'patentPlate',
    select: '-__v -id' 
    })
    .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
            .populate({
                path: 'origin', 
                select: '-__v -id' 
              }) 
              .populate({
                path: 'destination', 
                select: '-__v -id' 
              }) 
              .populate({
                path: 'bookings', 
                select: '-__v -id' 
              })
              .populate({
                path: 'tripResumeId', 
                select: '-__v -id',
                populate: [
                    { 
                        path: 'valuations', 
                        select: '-__v -id' 
                    },
                    { 
                        path: 'passengers', 
                        select: '-__v -id -password -status -verificationCode -resetPasswordToken'
                    }
                ]
            }).exec();
    // const fields = ['email','name','lastname'];
    // const driver = await this.userModel.findOne({email: trip.driver}).select(fields.join(' ')).exec();
    const result = this.getTrip(trip); 
    return result;	
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripModel.findById(id).select('-__v -id') 
    .populate({
      path: 'driver', 
      localField: 'driver',
      foreignField: 'email',
      select: driverView , 
  })
  .populate({
    path: 'vehicle', 
    localField: 'vehicle',
    foreignField: 'patentPlate',
    select: '-__v -id' 
    })
    .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
           .populate({
                path: 'bookings', 
                select: '-__v -id' 
              })
                .populate({
                  path: 'tripResumeId', 
                  select: '-__v -id',
                  populate: [
                      { 
                          path: 'valuations', 
                          select: '-__v -id' 
                      },
                      { 
                          path: 'passengers', 
                          select: '-__v -id -password -status -verificationCode -resetPasswordToken'
                      }
                  ]
              }).exec();    

    return trip;

  }

  async findByUUIDd(id: string): Promise<Trip> {
    const trip = await this.tripModel.find({id}).select('-__v -id') 
    .populate({
      path: 'driver', 
      localField: 'driver',
      foreignField: 'email',
      select: driverView , 
  })
  .populate({
    path: 'vehicle', 
    localField: 'vehicle',
    foreignField: 'patentPlate',
    select: '-__v -id' 
    })
            .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
            .populate({
                path: 'origin', 
                select: '-__v -id' 
              }) 
              .populate({
                path: 'destination', 
                select: '-__v -id' 
              }) 
              .populate({
                path: 'bookings', 
                select: '-__v -id' 
              })
              .populate({
                path: 'tripRequests', 
                select: '-__v -id' })
             
                .populate({
                  path: 'tripResumeId', 
                  select: '-__v -id',
                  populate: [
                      { 
                          path: 'valuations', 
                          select: '-__v -id' 
                      },
                      { 
                          path: 'passengers', 
                          select: '-__v -id -password -status -verificationCode -resetPasswordToken'
                      }
                  ]
              }).exec();
              const result =this.getTrip(trip);
              return result;
  }

  async findNonDriverTrips(email: string): Promise<Trip[]> {
    const trips =  await this.tripModel
    .find({ driver: { $ne: email } })
    .populate({
      path: 'driver', 
      localField: 'driver',
      foreignField: 'email',
      select: driverView , 
  })
  .populate({
    path: 'vehicle', 
    localField: 'vehicle',
    foreignField: 'patentPlate',
    select: '-__v -id' 
    })


  .populate({
      path: 'passengers', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken'
  })
    .populate({
      path: 'bookings', 
      select: '-__v -id' 
    })
    .populate({
      path: 'tripResumeId', 
      select: '-__v -id',
      populate: [
          { 
              path: 'valuations', 
              select: '-__v -id' 
          },
          { 
              path: 'passengers', 
              select: '-__v -id -password -status -verificationCode -resetPasswordToken'
          }
      ]
  }).exec();
  
  const result = trips.map(trip => this.getTrip(trip));
  return result;

  }

  async findAll(): Promise<Trip[]> {
    const trip = await this.tripModel.find().select('-__v -id')
    .populate({
      path: 'driver', 
      localField: 'driver',
      foreignField: 'email',
      select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
  })
  .populate({
    path: 'vehicle', 
    localField: 'vehicle',
    foreignField: 'patentPlate',
    select: '-__v -id' 
    })
  .populate({
      path: 'passengers', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken'
    })
  .populate({
      path: 'origin', 
      select: '-__v -id' 
    }) 
    .populate({
      path: 'destination', 
      select: '-__v -id' 
    }) 
    .populate({
      path: 'bookings', 
      select: '-__v -id' 
    })
    .populate({
      path: 'tripResumeId', 
      select: '-__v -id',
      populate: [
          { 
              path: 'valuations', 
              select: '-__v -id' 
          },
          { 
              path: 'passengers', 
              select: '-__v -id -password -status -verificationCode -resetPasswordToken'
          }
      ]
  }).exec();
    return trip;
  }

  async create(trip: Trip): Promise<Trip> {
    return await this.tripModel.create(trip);
   
  }

  async update(trip: Trip) : Promise<Trip> {   
    const updatedTrip = await this.tripModel.findOneAndUpdate({id:trip.id}, trip).exec();    
    return updatedTrip;
  }

  async updateStatus(id: string, newStatus: TripStatus) : Promise<Trip> {	
    try {
      // Buscar el viaje por su ID
      const trip = await this.tripModel.findOne({id});

      if (!trip) {
        throw new Error('Trip not found');
      }

      // Actualizar el campo status
      trip.status = newStatus;

      // Guardar los cambios en la base de datos
      const updatedTrip = await trip.save();

      return updatedTrip;
    } catch (error) {
      throw new Error(`Failed to update trip status: ${error.message}`);
    }
  }


  async passengersByTrip(
    id: string,
  ): Promise<any> {
    try {
      const trip = await this.tripModel.findOne({ id })
      .populate({path:'passengers', select: '+name +lastname +email'})
      .exec()
    
    } catch (error) {
      throw new Error('Error finding passengers: ' + error.message);
    }
  }
}
