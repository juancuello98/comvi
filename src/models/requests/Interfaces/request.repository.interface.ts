import { RequestDocument, Request } from "../request.schema";
// import {  ActionRequestDTO} from "../dto/action-request.dto";
// import {  CancelRequestDTO} from "../dto/cancel-request.dto";
// import {  ChangeStatusOfRequestDTO} from "../dto/change-status-request.dto";
// import {  ExtendedRequestDTO} from "../dto/extended-request.dto";
// import {  NewRequestDTO} from "../dto/new-request.dto";
import { ClientSession } from "mongoose";
import { IRepository } from "src/repository/mongodb.repository";

export interface IRequestRepository  {
    startSession(): Promise<ClientSession>;
    create(createRequest: Request): Promise<Request>;
    findAll(): Promise<RequestDocument[]>;
    findById(id: string): Promise<Request>;
    find(campoos:{}): Promise<Request[]>;
    update(id: string, updateDTO: Request): Promise<Request>;
    delete(id: string): Promise<void>;
    getRequest(req:RequestDocument): Request; 
  }