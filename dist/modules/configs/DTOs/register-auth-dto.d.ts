import { LoginAuthDTO } from './login-auth.dto';
declare const RegisterAuthDto_base: import("@nestjs/mapped-types").MappedType<Partial<LoginAuthDTO>>;
export declare class RegisterAuthDto extends RegisterAuthDto_base {
    name: string;
    lastName: string;
    username: string;
}
export {};
