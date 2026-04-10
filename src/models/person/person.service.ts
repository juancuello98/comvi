import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { IPERSON_REPOSITORY } from './repository/constants/person.repository.constant';
import { IPersonRepository } from './repository/interface/person.repository.interface';
import { Person } from './schema/person.schema';

@Injectable()
export class PersonService {

    constructor(
        @Inject(IPERSON_REPOSITORY)
        private readonly personRepository: IPersonRepository,
    ) {}
  create(createPersonDto: CreatePersonDto) {
    const person = new Person();
    person.name = createPersonDto.name; 
    person.dni = createPersonDto.dni;
    person.birthday = createPersonDto.birthday;
    person.lastname = createPersonDto.lastname;
    person.picture = createPersonDto.picture;
    person.validated = false;
    this.personRepository.create(person);
    return 'This action adds a new person';
  }

  createPersonForDoc(createPersonDto: CreatePersonDto) {
    const person = new Person();
    person.name = createPersonDto.name; 
    person.dni = createPersonDto.dni;
    person.birthday = createPersonDto.birthday;
    person.lastname = createPersonDto.lastname;
    person.picture = createPersonDto.picture;
    person.validated = false;
    this.personRepository.create(person);
    return person;
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
