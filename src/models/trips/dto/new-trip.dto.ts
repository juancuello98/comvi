import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExistingtTripDTO } from './existing-trip.dto';

export class NewTripDTO extends PartialType(ExistingtTripDTO) {
  @IsOptional()
  driver: string;

  @IsNotEmpty()
  origin: unknown;

  @IsNotEmpty()
  destination: unknown;

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
