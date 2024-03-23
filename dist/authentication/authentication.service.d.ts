import { JwtService } from '@nestjs/jwt';
import { UserService } from '../models/users/user.service';
import { LoginDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserDTO } from '../models/users/interfaces/user-details.interface';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidatedDTO } from 'src/models/users/interfaces/user-validated.interface';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { PasswordToken } from '../models/users/passwordToken.schema';
import { UserDocument } from 'src/models/users/user.schema';
import { MailService } from 'src/mail/config.service';
export declare class AuthService {
    private mailService;
    private jwtTokenService;
    private userService;
    private readonly logger;
    constructor(mailService: MailService, jwtTokenService: JwtService, userService: UserService);
    generateRandomString(num: any): string;
    GenerateToken(): Promise<PasswordToken>;
    IsExpired(token: PasswordToken): Promise<boolean>;
    compareResetPasswordCode(token: string, user: UserDocument): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    register(registerData: Readonly<NewUserDTO>): Promise<UserDTO | any>;
    createVerififyEmailCode(): Promise<string>;
    doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
    validate(email: string, password: string): Promise<UserDTO | null>;
    login({ email, password }: LoginDTO): Promise<Record<string, string>>;
    loginWithCredentials(user: UserDTO): Promise<{
        token: string;
    }>;
    verifyEmailCode({ email, code, }: UserVerificationDTO): Promise<boolean>;
    validatePasswordToken(passwordTokenDTO: PasswordTokenDTO): Promise<UserValidatedDTO | any>;
}
