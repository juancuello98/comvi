import { ExistingtUserDTO } from './existing-user.dto';
declare const NewUserDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ExistingtUserDTO>>;
export declare class NewUserDTO extends NewUserDTO_base {
    lastname: string;
    name: string;
}
export {};
