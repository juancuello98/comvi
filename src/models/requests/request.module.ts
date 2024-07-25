// import { User, UserSchema } from '@/users/user.schema';
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CommonModule } from '../../common/common.module';
// import { Trip, TripSchema } from '../trips';
// import { RequestController } from './request.controller';
// import { Request, RequestSchema } from './request.schema';
// import { RequestService } from './request.service';
// @Module({
//   imports: [MongooseModule.forFeature([
//     { name: Request.name, schema: RequestSchema },
//     {name: Trip.name, schema:TripSchema},
//     {name: User.name, schema:UserSchema}
//   ]),
//   CommonModule
// ],
//   controllers: [RequestController],
//   providers: [RequestService],
//   exports: [RequestService],
// })
// export class RequestModule {}
