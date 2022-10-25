import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { Request, RequestDocument } from './request.schema';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { StatusRequest } from './enums/status.enum';
import { ExtendedRequestDTO } from './dto/extended-request.dto';

@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name);

  constructor(
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    private readonly responseHelper : ResponseHelper
  ){}

  async findByStatus(status: string): Promise<ResponseDTO> {
    const requests = this.requestModel.find({status}).exec();
    return this.responseHelper.makeResponse(true,'requests by status succesfully.',requests,HttpStatus.OK) 
  }

  async findAll(email: string): Promise<ResponseDTO> {

    let message = 'requests not found';

    try {
      const items = await this.requestModel.find().exec();

      if(items.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);

      message = 'Successfully found requests';

      const itemsFiltered = items.filter(x => x.email !== email )

      if(itemsFiltered.length == 0) this.responseHelper.makeResponse(false,message,null,HttpStatus.NOT_FOUND);
    
      return this.responseHelper.makeResponse(false,message,itemsFiltered,HttpStatus.OK);

    } catch (error) {
      console.error('Error in: ',error);

      return this.responseHelper.makeResponse(true,message,null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(requestId: string): Promise<ResponseDTO> {
    try {
      
      let message = 'Successfully found requests';
      let status = HttpStatus.OK;
      let request = await this.requestModel.findById(requestId).exec();
      if (!request)
      {
        request = null;
        message = 'Not found requests';
        status = HttpStatus.NOT_FOUND;
      };
      return this.responseHelper.makeResponse(false, message,request,status);
    } catch (error) {
      console.error('Error: ',error);
      return this.responseHelper.makeResponse(true,'Error in findById',null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create( req: ExtendedRequestDTO ): Promise<ResponseDTO> {

    let partnerQuantity = ! req.partnerQuantity ? 0 : req.partnerQuantity;
    const newRequest = new this.requestModel(
    { 
      email : req.email,
      tripId : req.tripId,
      description : req.description,
      hasEquipment : req.hasEquipment,
      hasPartner : req.hasPartner,
      partnerQuantity : partnerQuantity,
      totalPassenger : 1 + partnerQuantity,
      createdTimestamp : Date.now().toString(),
      status : StatusRequest.ON_HOLD
    });

    const requestCreated = await newRequest.save();

    return this.responseHelper.makeResponse(false,'Request was sended succesfully.',requestCreated,HttpStatus.OK);
  }

  async update(
    request: RequestDocument
  ): Promise<RequestDocument> {
    return request.save();
  }
}



