import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service';
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { exUserData } from 'src/swagger/swagger.mocks';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly requestHelper: RequestHelper,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get data from user.' })
  @ApiResponse({ status: 200, description: 'The user has been successfully founded.', example:
    exUserData
   })
  @ApiBearerAuth()
  @Get('myData')
  async findOne(@Req() request: Request): Promise<ResponseDTO> {
    console.log(request.headers.authorization)
    const email = this.requestHelper.getPayload(request);
    const user = await this.usersService.getUserData(email);
    return user;
  }
}