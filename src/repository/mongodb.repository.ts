import { ClientSession } from "mongoose";

export interface IRepository<Type, Document>  {
    startSession(): Promise<ClientSession>;
    create(createRequest: Type): Promise<Document>;
    findAll(): Promise<Document[]>;
    findById(id: string): Promise<Document>;
    find(campoos:{}): Promise<Document[]>;
    update(id: string, updateDTO: Document): Promise<Document>;
    delete(id: string): Promise<void>;
    getRequest(req:Document): Type; 
}