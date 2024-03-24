import * as bcrypt from 'bcrypt';
export const jwtConstants = {
  secret: bcrypt.hash('comvi', 12).toString(), //TODO: Cambiar y pasar por variable de entorno
};
