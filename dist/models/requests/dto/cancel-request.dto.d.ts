import { ActionRequestDTO } from './action-request.dto';
declare const CancelRequestDTO_base: import("@nestjs/mapped-types").MappedType<Partial<ActionRequestDTO>>;
export declare class CancelRequestDTO extends CancelRequestDTO_base {
    newStatus: string;
    description: string;
}
export {};
