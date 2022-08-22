import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PasswordToken, PasswordTokenDocument } from './passwordToken.schema';

@Injectable()
export class PasswordTokenService {
  constructor(
    @InjectModel(PasswordToken.name) private readonly passwordTokenModel: Model<PasswordTokenDocument>,
  ) {}

  
public GenerateToken(){
  const token = new PasswordToken();
  const auxDate = new Date();
  token.created = auxDate;
  auxDate.setTime(auxDate.getTime()+60*60*1000); 
  token.expire = auxDate; 
  token.code = this.generateRandomString(6);
  return token;
}

public IsExpired(token: PasswordToken){
  const auxDate = new Date();
  if(auxDate < token.expire) {return true;}
  else{return false;}
}


private  generateRandomString(num) {
//const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result1= Math.random().toString(36).substring(0,num);       

return result1;
}


  }

  