import { InjectModel } from "@nestjs/mongoose";
import mongoose, { ClientSession, Model, Query, SortOrder } from "mongoose";
import { MongoDuplicateKeyError } from "@/common/error/mongodb.errors";
import { IPersonRepository } from "./interface/person.repository.interface"; 
import { Person ,PersonDocument } from "../schema/person.schema";

export class PersonMongodbRepository implements IPersonRepository {
    constructor(
        @InjectModel(Person.name) private readonly personModel: Model<PersonDocument>,
    ) { }
    
    async setStatus(id: string, status: string): Promise<Person> {
        const person = await this.personModel.findOneAndUpdate({ _id: id }, { status: status }, { new: true }).exec();
        return person;
    }

    async findByPassenger(cuil: string): Promise<Person[]> {
        const filter = {passengers: { $elemMatch: { cuil: cuil } }};

        return this.personModel.find(filter).exec();
    }
    async findByOwner(email: string): Promise<Person[]> {

        const filter = {email:email};

        return this.personModel.find(filter).exec();    }

    async remove(id: string): Promise<boolean> {

       const person =  await this.personModel.remove({ _id: id }).exec();
       return person ? true : false;
    }
    getAllPassengers(): Promise<Person[]> {
        throw new Error("Method not implemented.");
    }

    async findWithPopulate(filter: any, populateFields: { [key: string]: string[] }, sort: string | {
        [key: string]: SortOrder} ): Promise<Person[]> {
        let query: Query<Person[], Person> = this.personModel.find(filter);

        for (const [table, fields] of Object.entries(populateFields)) {
            query = query.populate(table, fields.join(' ')); // Aplica populate dinámicamente
        }

        if (sort) {
            query = query.sort(sort);
        }

        return query.exec(); // Esto debería funcionar correctamente si los tipos son compatibles
    }   

    async findAll(): Promise<Person[]> {
        return await this.personModel.find().exec();
    }

    async findMyPersonsByCuil(cuil: number): Promise<Person[]> {
        const filter = {passengers: { $elemMatch: { cuil: cuil } }};
        return await this.personModel.find(filter).sort({createdTimestamp: 'desc'}).exec();
    }

    async findById(id: string): Promise<Person> {
        return this.personModel.findById(id).sort({createdTimestamp: 'desc'}).exec();
    }

    async find(campoos: {}): Promise<Person[]> {
        return this.personModel.find(campoos).select('-__v').sort({createdTimestamp: 'desc'}).exec();   
    }

    async findAllPerson(): Promise<Person[]> {
        return this.personModel.find().sort({createdTimestamp: 'desc'}).exec();
    }

    async create( req:Person): Promise<Person> {
        try {
            const personCreated = await this.personModel.create(req);
            return personCreated;
        } catch (error) {
            throw MongoDuplicateKeyError.isMongodbError(error)
        }

        
    }

    async update(person:Person): Promise<Person> {
        const book = await this.personModel.findOneAndUpdate( {dni: person.dni}, person, { new: true }
        );
        return book;
    }

    async findByPatent(patent: string): Promise<Person> {
        const person = await this.personModel.findOne({patentPlate: patent}).exec();
        return person;
    }

    async findByUser(email: string): Promise<Person[]> {
        const person = await this.personModel.find({ email }).exec();
        return person;
    }

    async delete(id: string) {
        try {
            await this.personModel.deleteOne({ _id: id });
        } catch (error) {
            throw error
        }
    }
}