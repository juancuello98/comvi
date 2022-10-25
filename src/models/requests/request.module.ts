
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './request.schema';
import { RequestService } from './request.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),CommonModule
],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}