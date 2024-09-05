import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwtDecode from 'jwt-decode';
import { Document } from 'mongoose';

interface ComviHeader extends IncomingHttpHeaders {
  authorization?: string;
}

interface UserPayload {
  id?: string;
  name?: string;
  email?: string;
}

interface Payload {
  user?: UserPayload;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RequestHelper {
  constructor() { }

  getPayload = (request: Request): string => {
    try {
      let email: string = '';
      const req: Request = request;
      const head: ComviHeader = req.headers;
      const auth = head?.authorization;
      if (head?.authorization) {
        const token = auth?.match(/^Bearer\s+(\S+)$/)[1];
        if (!token) {
          throw new Error('Authentication token is missing. Please provide a valid token to access this resource.');
        }
        const payload: Payload = jwtDecode(token);
        email = payload.user.email;
      }
      return email;
    } catch (error) {
      console.error(error);
    }
  };
}
