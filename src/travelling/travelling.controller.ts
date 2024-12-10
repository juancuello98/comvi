import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TravellingService } from './travelling.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { ResponseDTO } from '@/common/interfaces/responses.interface';

@ApiTags('travelling')
@Controller('travelling')
export class TravellingController {
  constructor(private readonly travellingService: TravellingService) {}

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Create a new trip' })
  // @ApiBody({
  //   type: NewTripDTO, examples: {
  //     example1: {
  //       summary: 'Typical trip creation.',
  //       description: 'Example of a typical trip creation.',
  //       value: exNewTrip
  //     }
  //   }
  // })
  // @ApiResponse({ status: 201, description: 'Trip was created succesfully.', example: exNewTripResponse})
  // @Post('/publish')
  // async create(@Request() req, @Body()): Promise<ResponseDTO> {
  //   return await this.travellingService.create(req.body);
    
  // }

}
