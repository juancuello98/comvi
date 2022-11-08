import { ActionRequestDTO } from './action-request.dto';
declare const ChangeStatusOfRequestDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ActionRequestDTO>>;
export declare class ChangeStatusOfRequestDTO extends ChangeStatusOfRequestDTO_base {
    newStatus: string;
    description: string;
}
export {};
