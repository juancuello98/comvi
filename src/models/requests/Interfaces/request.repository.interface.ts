import { RequestDocument, Request } from "../request.schema";
import {  ActionRequestDTO} from "../dto/action-request.dto";
import {  CancelRequestDTO} from "../dto/cancel-request.dto";
import {  ChangeStatusOfRequestDTO} from "../dto/change-status-request.dto";
import {  ExtendedRequestDTO} from "../dto/extended-request.dto";
import {  NewRequestDTO} from "../dto/new-request.dto";
import { ClientSession } from "mongoose";
import { IRepository } from "src/repository/mongodb.repository";

export interface IRequestRepository extends IRepository<Request, RequestDocument> {
    startSession(): Promise<ClientSession>;
    create(createRequest: Request): Promise<RequestDocument>;
    findAll(): Promise<RequestDocument[]>;
    findById(id: string): Promise<RequestDocument>;
    find(campoos:{}): Promise<RequestDocument[]>;
    update(id: string, updateDTO: Request): Promise<RequestDocument>;
    delete(id: string): Promise<void>;
    getRequest(req:RequestDocument): Request; 
  }