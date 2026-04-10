import { Person } from "../../schema/person.schema";

export interface IPersonRepository {
  //getSession(): Promise<ClientSession>;
  findAll(): Promise<Person[]>;
  findMyPersonsByCuil(cuil: number): Promise<Person[]>;
  findByPassenger(passenger: string): Promise<Person[]>;
  findByOwner(email: string): Promise<Person[]>;
  find(field: Record<string, any>): Promise<Person[]>;
  findById(id: string): Promise<Person> ;
  create(booking: Person): Promise<Person>;
  update(booking: Person) : Promise<Person>;
  remove(id: string): Promise<boolean>;
  setStatus(id: string, status: string): Promise<Person>;
  getAllPassengers(): Promise<Person[]>;
}
  // findByIdAndDriver(driver: string, id: string): Promise<Person>;}