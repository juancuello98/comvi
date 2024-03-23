import { LoginDTO } from './existing-user.dto';
declare const NewUserDTO_base: import("@nestjs/mapped-types").MappedType<Partial<LoginDTO>>;
export declare class NewUserDTO extends NewUserDTO_base {
    lastname: string;
    name: string;
}
export {};
