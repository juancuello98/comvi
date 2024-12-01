import { InjectModel } from "@nestjs/mongoose";
import { Booking, BookingDocument } from "../booking.schema";
import mongoose, { ClientSession, Model, Query, SortOrder } from "mongoose";
import { MongoDuplicateKeyError } from "@/common/error/mongodb.errors";
import { IBookingRepository } from "../interface/booking.repository.interface"; 
import { Person } from "../../person/schema/person.schema";

export class BookingMongodbRepository implements IBookingRepository {
    constructor(
        @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    ) { }
    
    async setStatus(id: string, status: string): Promise<Booking> {
        const booking = await this.bookingModel.findOneAndUpdate({ _id: id }, { status: status }, { new: true }).exec();
        return booking;
    }

    async findByPassenger(cuil: string): Promise<Booking[]> {
        const filter = {passengers: { $elemMatch: { cuil: cuil } }};

        return this.bookingModel.find(filter).exec();
    }
    async findByOwner(email: string): Promise<Booking[]> {

        const filter = {email:email};

        return this.bookingModel.find(filter).exec();    }

    async remove(id: string): Promise<boolean> {

       const booking =  await this.bookingModel.remove({ _id: id }).exec();
       return booking ? true : false;
    }
    getAllPassengers(): Promise<Person[]> {
        throw new Error("Method not implemented.");
    }

    async findWithPopulate(filter: any, populateFields: { [key: string]: string[] }, sort: string | {
        [key: string]: SortOrder} ): Promise<Booking[]> {
        let query: Query<Booking[], Booking> = this.bookingModel.find(filter);

        for (const [table, fields] of Object.entries(populateFields)) {
            query = query.populate(table, fields.join(' ')); // Aplica populate dinámicamente
        }

        if (sort) {
            query = query.sort(sort);
        }

        return query.exec(); // Esto debería funcionar correctamente si los tipos son compatibles
    }   

    async findAll(): Promise<Booking[]> {
        return await this.bookingModel.find().exec();
    }

    async findMyBookingsByCuil(cuil: number): Promise<Booking[]> {
        const filter = {passengers: { $elemMatch: { cuil: cuil } }};
        return await this.bookingModel.find(filter).sort({createdTimestamp: 'desc'}).exec();
    }

    async findById(id: string): Promise<Booking> {
        return this.bookingModel.findById(id).sort({createdTimestamp: 'desc'}).exec();
    }

    async find(campoos: {}): Promise<Booking[]> {
        return this.bookingModel.find(campoos).select('-__v').sort({createdTimestamp: 'desc'}).exec();   
    }

    async findAllBooking(): Promise<Booking[]> {
        return this.bookingModel.find().sort({createdTimestamp: 'desc'}).exec();
    }

    getBooking(req:Booking): Booking {
            const booking = new Booking()
            booking.equipment = req.equipment;
            booking.packajes = req.packajes;
            booking.passengers = req.passengers;
            booking.status = req.status;
            booking.trip = req.trip;
            booking.owner = req.owner;
            booking.id = req.id;
            return booking;

}

    async create( req:Booking): Promise<Booking> {
        try {
            const bookingCreated = new this.bookingModel(
            {
                equipment: req.equipment,
                packajes: req.packajes,
                passengers: req.passengers,
                status: req.status,
                trip: req.trip,
                owner: req.owner,
                id: req.id,
            });

            return bookingCreated;
        } catch (error) {
            throw MongoDuplicateKeyError.isMongodbError(error)
        }

        
    }

    async update(booking:Booking): Promise<Booking> {
        const book = await this.bookingModel.findOneAndUpdate( {_id: booking.id}, booking, { new: true }
        );
        return book;
    }

    async findByPatent(patent: string): Promise<Booking> {
        const booking = await this.bookingModel.findOne({patentPlate: patent}).exec();
        return booking;
    }

    async findByUser(email: string): Promise<Booking[]> {
        const booking = await this.bookingModel.find({ email }).exec();
        return booking;
    }

    async delete(id: string) {
        try {
            await this.bookingModel.deleteOne({ _id: id });
        } catch (error) {
            throw error
        }
    }
}