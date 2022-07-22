import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    age: number;

    @IsString()
    description: string;
}
