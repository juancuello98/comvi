import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schema/person.schema';
import { PersonMongodbRepository } from './repository/person.mongodb.repository';
import { IPERSON_REPOSITORY } from './repository/constants/person.repository.constant';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';


@Module({
      imports: [
        MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    ],
  controllers: [PersonController],
  providers: [PersonMongodbRepository,  {
    provide: IPERSON_REPOSITORY,
    useClass: PersonMongodbRepository,
  },
  PersonService,  
],

  exports: [PersonMongodbRepository, IPERSON_REPOSITORY],
})
export class PersonModule {}
