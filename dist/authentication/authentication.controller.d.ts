import { AuthService } from './authentication.service';
import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserVerificationDTO } from 'src/models/users/dto/user-verification.dto';
import { UserDetails } from 'src/models/users/interfaces/user-details.interface';
import { UserValidated } from 'src/models/users/interfaces/user-validated.interface';
import { RequestResetPasswordDTO } from '../models/PasswordToken/dto/request-reset-password-dto';
import { ResetPasswordDTO } from '../models/PasswordToken/dto/reset-password-dto';
import { PasswordTokenDTO } from '../models/PasswordToken/dto/token-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(user: NewUserDTO): Promise<UserDetails | null>;
    validateTokenEmail(user: UserVerificationDTO): Promise<UserValidated | any>;
    validatePasswordToken(token: PasswordTokenDTO): Promise<UserValidated | any>;
    loginUser(user: ExistingtUserDTO): Promise<{
        token: string;
    } | null>;
    requestResetPassword(token: RequestResetPasswordDTO): Promise<boolean | any>;
    resetPassword(token: ResetPasswordDTO): Promise<boolean | any>;
    testUser(user: ExistingtUserDTO): {
        email: string;
    };
}
