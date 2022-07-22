import { AuthFirebaseService } from './auth-firebase.service';
import { LoginAuthDTO } from '../configs/DTOs/login-auth.dto';
import { RegisterAuthDto } from '../configs/DTOs/register-auth-dto';
export declare class AuthFirebaseController {
    private readonly authService;
    constructor(authService: AuthFirebaseService);
    registerUser(userObject: RegisterAuthDto): Promise<import("@firebase/auth").UserCredential>;
    loginUser(userObjectLogin: LoginAuthDTO): Promise<string>;
}
