import { JwtService } from '@nestjs/jwt';
import { MailService } from '../config/mail/config.service';
import { UserService } from '../models/users/user.service';
import { ExistingtUserDTO } from '../models/users/dto/existing-user.dto';
import { NewUserDTO } from '../models/users/dto/new-user.dto';
import { UserDetails } from '../models/users/interfaces/user-details';
import { UserVerificationDTO } from '../models/users/dto/user-verification.dto';
import { UserValidated } from 'src/models/users/interfaces/user-validated';
export declare class AuthService {
    private mailService;
    private jwtService;
    private userService;
    private readonly logger;
    constructor(mailService: MailService, jwtService: JwtService, userService: UserService);
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
}
