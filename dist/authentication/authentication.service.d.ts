import { JwtService } from '@nestjs/jwt';
import { UserService } from '../models/users/user.service';
import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserDetails } from '../models/users/interfaces/user-details.interface';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidated } from 'src/models/users/interfaces/user-validated.interface';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { PasswordTokenDTO } from './dto/token-password.dto';
import { PasswordToken } from '../models/users/passwordToken.schema';
import { UserDocument } from 'src/models/users/user.schema';
import { MailService } from 'src/config/mail/config.service';
export declare class AuthService {
    private mailService;
    private jwtService;
    private userService;
    private readonly logger;
    constructor(mailService: MailService, jwtService: JwtService, userService: UserService);
    generateRandomString(num: any): string;
    GenerateToken(): Promise<PasswordToken>;
    IsExpired(token: PasswordToken): Promise<boolean>;
    compareResetPasswordCode(token: string, user: UserDocument): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    register(user: Readonly<NewUserDTO>): Promise<UserDetails | any>;
    generateAndSendEmailCodeVerification(): Promise<number>;
    emailVerificated(email: string): Promise<boolean>;
    doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
    validateUser(email: string, password: string): Promise<UserDetails | null>;
    login(existingUser: ExistingtUserDTO): Promise<{
        token: string;
    }> | null;
    validationCode(verifyUser: UserVerificationDTO): Promise<UserValidated | any>;
    sendEmailPasswordToken(email: string, name: string, token: string): Promise<void>;
    requestResetPassword(userEmail: string): Promise<boolean | any>;
    resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<boolean | any>;
    validatePasswordToken(passwordTokenDTO: PasswordTokenDTO): Promise<UserValidated | any>;
}
