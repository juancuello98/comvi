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

export class NewTripDTO extends PartialType(ExistingtTripDTO) {
  @IsOptional()
  driver: string;

  @IsNotEmpty()
  origin: Location | string;

  @IsNotEmpty()
  destination: Location | string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  allowPackage: boolean;

  @IsBoolean()
  @IsNotEmpty()
  allowPassenger: boolean;

  @IsNumber()
  @IsNotEmpty()
  peopleQuantity: number;

  @IsNotEmpty()
  vehicle: string;

  @IsString()
  @IsNotEmpty()
  startedTimestamp: string;
}
