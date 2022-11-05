import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service'
import { CreateUserDto } from '../../models/users/dto/create-user.dto';
import { UpdateUserDto } from '../../models/users/dto/update-user.dto';
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';


@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService,
    private readonly requestHelper: RequestHelper) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //return this.usersService.create(createUserDto);
  }
  
  @Get('myData')
  findOne(@Req() request: Request) : Promise<ResponseDTO> {
    const userEmail = this.requestHelper.getPayload(request);
    return this.usersService.getUserData(userEmail);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.usersService.remove(+id);
  }

  @Post('firebase')
  getFirebase(@Req() request: Request) : string {
    return 'Hello ' + request['user'] + ' !';
  }
}