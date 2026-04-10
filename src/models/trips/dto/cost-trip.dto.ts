import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { ExistingtTripDTO } from './existing-trip.dto';
import { Location } from '@/locations/location-schema';
import { TripStatus } from '../enums/state.enum';

export class CostTripDto extends PartialType(ExistingtTripDTO) {
 }
