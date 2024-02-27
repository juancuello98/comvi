import { Puntaje } from '../entities/puntaje.enums';
import { CreateValuationDto } from './create-valuation.dto';
declare const UpdateValuationDto_base: import("@nestjs/common").Type<Partial<CreateValuationDto>>;
export declare class UpdateValuationDto extends UpdateValuationDto_base {
    id: string;
    detalle: string;
    puntaje: Puntaje;
}
export {};
