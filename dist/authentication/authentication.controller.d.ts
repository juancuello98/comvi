import { AuthService } from './authentication.service';
import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';
import { UserDetails } from 'src/models/users/interfaces/user-details';
import { UserValidated } from 'src/models/users/interfaces/user-validated';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(user: NewUserDTO): Promise<UserDetails | null>;
    validateTokenEmail(user: UserVerificationDTO): Promise<UserValidated | any>;
    loginUser(user: ExistingtUserDTO): Promise<{
        token: string;
    } | null>;
    testUser(user: ExistingtUserDTO): {
        email: string;
    };
}
