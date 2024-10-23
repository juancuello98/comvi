
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewTripDTO } from '../dto/new-trip.dto';
import { TripStatus } from '../enums/state.enum';
import { Trip, TripDocument } from '../trip.schema';
import { ITripRepository } from '../interface/trip.repository.interface';
import { User, UserDocument } from '@/users/user.schema';

export class TripMongodbRepository implements ITripRepository {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByDriver(driver: string): Promise<TripDocument[]|any[]> {

    const trips = await this.tripModel
      .find({ driver })
      .sort({ createdTimestamp: 'desc' })
      .select('-__v -id')
      .populate('vehicle')
      .populate('origin')
      .populate('destination')
      .select('-__v -id')
      .exec();
    return trips;
  }

  async find(field: any): Promise<Trip[]|any[]> {
    return await this.tripModel.find(field).select('-__v -id').exec();
  }

  async findByIdWithDriver(id: any): Promise<any> {
    const trip = await this.tripModel.findOne({id}).select('-__v -id') 
            .populate({
                path: 'driver', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
            })
            .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
            .populate({
              path: 'vehicle', 
              select: '-__v -id' 
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
            }).exec();
    const fields = ['email','name','lastname'];
    const driver = await this.userModel.findOne({email: trip.driver}).select(fields.join(' ')).exec();
    return {...trip,driver};
  }

  async findById(id: string): Promise<TripDocument|any> {
    const trip = await this.tripModel.findById(id).select('-__v -id') 
            .populate({
                path: 'driver', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
            })
            .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
            .populate({
              path: 'vehicle', 
              select: '-__v -id' 
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
    return trip;
  }

  async findByUUIDd(id: string): Promise<TripDocument|any> {
    const trip = await this.tripModel.find({id}).select('-__v -id') 
            .populate({
                path: 'driver', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
            })
            .populate({
                path: 'passengers', 
                select: '-__v -id -password -status -verificationCode -resetPasswordToken'
            })
            .populate({
              path: 'vehicle', 
              select: '-__v -id' 
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
    return trip;
  }

  async findNonDriverTrips(email: string): Promise<TripDocument[]|any[]> {
    return await this.tripModel
    .find({ driver: { $ne: email } })
    .populate({
      path: 'driver', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
  })
  .populate({
      path: 'passengers', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken'
  })
  .populate({
    path: 'vehicle', 
    select: '-__v -id' 
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
  }).exec();
  }

  async findAll(): Promise<TripDocument[]|any[]> {
    const trip = await this.tripModel.find().select('-__v -id')
    .populate({
      path: 'driver', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken' 
  })
  .populate({
      path: 'passengers', 
      select: '-__v -id -password -status -verificationCode -resetPasswordToken'
  })
  .populate({
    path: 'vehicle', 
    select: '-__v -id' 
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
  }).exec();
    return trip;
  }

  async create(trip: NewTripDTO): Promise<TripDocument|any> {
    return await this.tripModel
    .create(trip);
  }

  async update(trip: Trip) : Promise<TripDocument|any> {

    const updatedTrip = await this.tripModel.updateOne({id: trip.id}, trip).exec();
    const tripUpdated = await this.tripModel.findOne({id: trip.id}).exec();
    return tripUpdated;

  }

  async updateStatus(id: string, newStatus: TripStatus) : Promise<TripDocument|any> {	
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

  async findByIdAndDriver(driver: string, id: string): Promise<any> {
    const filter = {
      driver,
      id,
    };

    const hasUserTrip = await this.tripModel.findOne(filter).lean().exec();

    return hasUserTrip;
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
