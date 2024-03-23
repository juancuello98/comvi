import { AuthService } from './authentication.service';
import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';
import { UserDTO } from 'src/models/users/interfaces/user-details.interface';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(user: NewUserDTO): Promise<UserDTO | null>;
    validateTokenEmail(user: UserVerificationDTO): Promise<UserValidatedDTO | any>;
    loginUser(user: LoginDTO): Promise<Record<string, string> | null>;
}
