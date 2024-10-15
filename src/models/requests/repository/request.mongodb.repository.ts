import { InjectModel } from "@nestjs/mongoose";
import { Request, RequestDocument } from "../request.schema";
import { ClientSession, Model } from "mongoose";
import {  ActionRequestDTO} from "../dto/action-request.dto";
import {  CancelRequestDTO} from "../dto/cancel-request.dto";
import {  ChangeStatusOfRequestDTO} from "../dto/change-status-request.dto";
import {  ExtendedRequestDTO} from "../dto/extended-request.dto";
import {  NewRequestDTO} from "../dto/new-request.dto";


import { IRequestRepository } from "../interfaces/request.repository.interface";
import { MongoDuplicateKeyError } from "@/common/error/mongodb.errors";

export class RequestMongodbRepository implements IRequestRepository {
    constructor(
        @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    ) { }

    async startSession(): Promise<ClientSession> {
        return this.requestModel.startSession();
    }

    async findAll(): Promise<RequestDocument[]> {
        return this.requestModel.find().sort({createdTimestamp: 'desc'}).exec();
    }
    async findById(id: string): Promise<RequestDocument> {
        return this.requestModel.findById(id).sort({createdTimestamp: 'desc'}).exec();
    }

    async find(campoos: {}): Promise<RequestDocument> {
        return this.requestModel.findOne(campoos).exec();   
    }

    async findMyRequest(): Promise<RequestDocument[]> {
        return this.requestModel.find().sort({createdTimestamp: 'desc'}).exec();
    }

    getRequest(req:RequestDocument): Request{
        return {
            userId : req.userId,
            email : req.email,
            tripId : req.tripId,
            description : req.description,
            hasEquipment : req.hasEquipment,
            hasPartner : req.hasPartner,
            partnerQuantity : req.partnerQuantity,
            totalPassenger : req.totalPassenger,
            createdTimestamp : req.createdTimestamp,
            status : req.status
        }   
    }

    async create( req:Request): Promise<RequestDocument> {
        try {
            const newRequest = new this.requestModel(
            {
              email : req.email,
              tripId : req.tripId,
              description : req.description,
              hasEquipment : req.hasEquipment,
              hasPartner : req.hasPartner,
              partnerQuantity : req.partnerQuantity,
              totalPassenger : req.totalPassenger,
              createdTimestamp : new Date().toISOString(),
              status : req.status
            });
      
            const requestCreated = await newRequest.save();
            return requestCreated;
        } catch (error) {
            throw MongoDuplicateKeyError.isMongodbError(error)
        }

        
    }

    async update(id: string, req:Request): Promise<RequestDocument> {
        const request = await this.requestModel
        .findOneAndUpdate(
            {_id: id}, req, { new: true }
        ).exec();
        return request;
    }

    async findByPatent(patent: string): Promise<RequestDocument> {
        const request = await this.requestModel.findOne({patentPlate: patent}).exec();
        return request;
    }

    async findByUser(email: string): Promise<RequestDocument[]> {
        const request = await this.requestModel.find({ email }).exec();
        return request;
    }

    async delete(id: string) {
        try {
            await this.requestModel.deleteOne({ _id: id });
        } catch (error) {
            throw error
        }
    }
}