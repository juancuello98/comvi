import * as bcrypt from 'bcrypt';
export const jwtConstants = {
  secret: bcrypt.hash(process.env.JWT_SECRET, 12).toString(),
};
