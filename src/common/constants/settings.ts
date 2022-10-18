
import * as bcrypt from 'bcrypt';
export const jwtConstants = {
    secret: bcrypt.hash('comv1app$jw7',12).toString() ,
  };