import { UserService } from '../users/user.service';
import { CreateUserDto } from '../../models/users/dto/create-user.dto';
import { UpdateUserDto } from '../../models/users/dto/update-user.dto';
import { Request } from 'express';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
export declare class UserController {
    private readonly usersService;
    private readonly requestHelper;
    constructor(usersService: UserService, requestHelper: RequestHelper);
    create(createUserDto: CreateUserDto): void;
    findOne(request: Request): Promise<ResponseDTO>;
    update(id: string, updateUserDto: UpdateUserDto): void;
    remove(id: string): void;
    getFirebase(request: Request): string;
}
