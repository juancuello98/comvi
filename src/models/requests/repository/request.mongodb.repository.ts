import { InjectModel } from "@nestjs/mongoose";
import { Request, RequestDocument } from "../request.schema";
import mongoose, { ClientSession, Model, Query, SortOrder } from "mongoose";
import { MongoDuplicateKeyError } from "@/common/error/mongodb.errors";
import { IRequestRepository } from "../Interfaces/request.repository.interface";

export class RequestMongodbRepository implements IRequestRepository {
    constructor(
        @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    ) { }

    async findWithPopulate(filter: any, populateFields: { [key: string]: string[] }, sort: string | {
        [key: string]: SortOrder} ): Promise<RequestDocument[]> {
        let query: Query<RequestDocument[], RequestDocument> = this.requestModel.find(filter);

        for (const [table, fields] of Object.entries(populateFields)) {
            query = query.populate(table, fields.join(' ')); // Aplica populate dinámicamente
        }

        if (sort) {
            query = query.sort(sort);
        }

        return query.exec(); // Esto debería funcionar correctamente si los tipos son compatibles
    }   

    async startSession(): Promise<ClientSession> {
        return this.requestModel.startSession();
    }

    // async findAll(populateFields: { [key: string]: string[] }={}): Promise<RequestDocument[]> {
    //     return await this.findWithPopulate({}, populateFields,{createdTimestamp: 'desc'});
    // }

    
    async findAll(): Promise<RequestDocument[]> {
        return await this.requestModel.find().populate("userId").populate("tripId").sort({createdTimestamp: 'desc'}).exec();
    }

    async findById(id: string): Promise<RequestDocument> {
        // const idObj = new mongoose.Types.ObjectId(id);
        return this.requestModel.findById(id).sort({createdTimestamp: 'desc'}).exec();
    }

    async find(campoos: {}): Promise<RequestDocument[]> {
        return this.requestModel.find(campoos).select('-__v').sort({createdTimestamp: 'desc'}).exec();   
    }

    async findAllRequest(): Promise<RequestDocument[]> {
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
              userId : req.userId,
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
        ).populate("userId").populate("tripId").exec();
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