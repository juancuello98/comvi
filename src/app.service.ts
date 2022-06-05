import { Injectable } from '@nestjs/common';

export enum Country {
  PE = 'Peru',
  CO = 'Colombia',
  AR = 'Argentina'
}

@Injectable()
export class AppService {
  getUser(): Object {
    const user = {
      username : 'juancuello98',
      password : 'assfg99Agkzx54',
      country: Country.AR ,
      address: 'Asturias 3023, Cordoba, Cordoba',
      origin: 'Cordoba',
      destination: 'Buenos Aires'
    }
    return user;
  }
}
