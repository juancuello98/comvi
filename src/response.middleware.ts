
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, response as Response, NextFunction } from 'express';
// import { finished } from 'stream';
// import {FastifyRequest, FastifyReply} from 'fastify';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
use(req: Request, res: Response, NextFunction: NextFunction) {
    console.log(req);
    console.log(res);
    NextFunction();
}
  
}
