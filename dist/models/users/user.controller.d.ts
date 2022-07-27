import { UserService } from '../users/user.service';
import { CreateUserDto } from '../../models/users/dto/create-user.dto';
import { UpdateUserDto } from '../../models/users/dto/update-user.dto';
import { Request } from 'express';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    create(createUserDto: CreateUserDto): void;
    findAll(): void;
    findOne(id: string): void;
    update(id: string, updateUserDto: UpdateUserDto): void;
    remove(id: string): void;
    getFirebase(request: Request): string;
}
