import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ResponseDTO } from '../../common/interfaces/responses.interface';
import { Trip, TripDocument } from '../trips/trip.schema';
import { User, UserDocument } from '../users/user.schema';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { Valuation, ValuationDocument } from './entities/valuation.schema';

@Injectable()
export class ValuationsService {
  private readonly logger = new Logger(ValuationsService.name);

  constructor(
    @InjectModel(Valuation.name)
    private readonly valuationModel: Model<ValuationDocument>,
    @InjectModel(Trip.name) private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async create(createValuationDto: CreateValuationDto) {
    const input = {
      email: createValuationDto.email,
      tripId: createValuationDto.tripId,
      detalle: createValuationDto.detalle,
      fechaHoraCreado: Date.now,
      fechaHoraModificado: Date.now,
      puntaje: createValuationDto.puntaje,
    };

    const newValuation = new this.valuationModel(input);
    try {
      const updatedValuation = await newValuation.save();
      console.log('Succesfully created: %o', updatedValuation);
    } catch (error) {
      console.log('Error: %s', error.message);
    }
    

    // try {
    //   const hasTrip = await this.tripModel.findById(createValuationDto.tripId);

    //   if (!hasTrip) {
    //     this.logger.log(
    //       `Not found trip ${createValuationDto.tripId} for user ${createValuationDto.email}`,
    //     );
    //     return this.responseHelper.makeResponse(
    //       false,
    //       `Not found trip ${createValuationDto.tripId} for user ${createValuationDto.email}`,
    //       null,
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    //   const updatedValuation = await newValuation.save();
    //   hasTrip.valuations.push(updatedValuation.id);
    //   this.logger.log(
    //     `A new valuation was added to the trip ${createValuationDto.tripId} for user ${createValuationDto.email}`,
    //   );
    //   return this.responseHelper.makeResponse(
    //     false,
    //     `A new valuation was added to the trip ${createValuationDto.tripId} for user ${createValuationDto.email}`,
    //     updatedValuation,
    //     HttpStatus.CREATED,
    //   );
    // } catch (error) {
    //   this.logger.log('Error in create: ', error);

    //   return this.responseHelper.makeResponse(
    //     true,
    //     'The valuation was not created',
    //     null,
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  // async findAll(email: string): Promise<ResponseDTO> {
  //   let message = 'valuations not found';

  //   try {
  //     const items = await this.valuationModel
  //       .find()
  //       .sort({ createdTimestamp: 'desc' })
  //       .exec();

  //     if (items.length == 0)
  //       return this.responseHelper.makeResponse(
  //         false,
  //         message,
  //         null,
  //         HttpStatus.NOT_FOUND,
  //       );

  //     message = 'Successfully found valuations';

  //     const itemsFiltered = items.filter((x) => x.email == email);

  //     if (itemsFiltered.length == 0)
  //       this.responseHelper.makeResponse(
  //         false,
  //         message,
  //         null,
  //         HttpStatus.NOT_FOUND,
  //       );

  //     return this.responseHelper.makeResponse(
  //       false,
  //       message,
  //       itemsFiltered,
  //       HttpStatus.OK,
  //     );
  //   } catch (error) {
  //     this.logger.log('Error in findAll: ', error);

  //     return this.responseHelper.makeResponse(
  //       true,
  //       message,
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async findOne(id: string) {
  //   let message = 'valuation not found';

  //   try {
  //     const valuation = await this.valuationModel.findById(id).exec();

  //     if (!valuation)
  //       return this.responseHelper.makeResponse(
  //         false,
  //         message,
  //         null,
  //         HttpStatus.NOT_FOUND,
  //       );

  //     message = 'Valuation Successfully founded ';

  //     return this.responseHelper.makeResponse(
  //       false,
  //       message,
  //       valuation,
  //       HttpStatus.OK,
  //     );
  //   } catch (error) {
  //     this.logger.log('Error in findById: ', error);

  //     return this.responseHelper.makeResponse(
  //       true,
  //       message,
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async update(updateValuationDto: UpdateValuationDto): Promise<ResponseDTO> {
  //   try {
  //     const hasValuation = await this.valuationModel.findByIdAndUpdate(
  //       updateValuationDto.id,
  //       updateValuationDto,
  //     ); //El DTO debe traer los valores no cambiados

  //     if (!hasValuation) {
  //       this.logger.log(
  //         `Not found valuation ${updateValuationDto.id} for user ${updateValuationDto}`,
  //       );
  //       return this.responseHelper.makeResponse(
  //         false,
  //         `Not found valuation ${updateValuationDto.id} for user ${updateValuationDto.email}`,
  //         null,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     this.logger.log(
  //       `The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`,
  //     );
  //     return this.responseHelper.makeResponse(
  //       false,
  //       `The valuation of the trip ${updateValuationDto.tripId} for user ${updateValuationDto.email} was updated`,
  //       hasValuation,
  //       HttpStatus.CREATED,
  //     );
  //   } catch (error) {
  //     this.logger.log('Error in create: ', error);

  //     return this.responseHelper.makeResponse(
  //       true,
  //       'The valuation was not created',
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async remove(id: string): Promise<ResponseDTO> {
  //   try {
  //     const hasValuation = await this.valuationModel.findByIdAndDelete(id); //El DTO debe traer los valores no cambiados

  //     if (!hasValuation) {
  //       this.logger.log(`Not found valuation ${id} for user`);
  //       return this.responseHelper.makeResponse(
  //         false,
  //         `Not found valuation ${id} for user`,
  //         null,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     this.logger.log(
  //       `The valuation of the trip ${hasValuation.tripId} for user ${hasValuation.email} was deleted`,
  //     );
  //     return this.responseHelper.makeResponse(
  //       false,
  //       `The valuation of the trip ${hasValuation.tripId} for user ${hasValuation.email} was deleted`,
  //       hasValuation,
  //       HttpStatus.CREATED,
  //     );
  //   } catch (error) {
  //     this.logger.log('Error in create: ', error);

  //     return this.responseHelper.makeResponse(
  //       true,
  //       'The valuation was not created',
  //       null,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
