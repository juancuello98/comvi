import { NewRequestDTO } from './new-request.dto';
declare const ExtendedRequestDTO_base: import("@nestjs/mapped-types").MappedType<Partial<NewRequestDTO>>;
export declare class ExtendedRequestDTO extends ExtendedRequestDTO_base {
    email: string;
}
export {};
