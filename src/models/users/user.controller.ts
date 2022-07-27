import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service'
import { CreateUserDto } from '../../models/users/dto/create-user.dto';
import { UpdateUserDto } from '../../models/users/dto/update-user.dto';
import { Request } from 'express';


@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    //return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.usersService.findOne(+id);
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