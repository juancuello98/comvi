import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
export declare class ValuationsController {
    private readonly valuationsService;
    private readonly requestHelper;
    constructor(valuationsService: ValuationsService, requestHelper: RequestHelper);
    create(createValuationDto: CreateValuationDto): Promise<ResponseDTO>;
    findAll(): Promise<ResponseDTO>;
    findOne(id: string): Promise<ResponseDTO>;
    update(updateValuationDto: UpdateValuationDto): Promise<ResponseDTO>;
    remove(id: string): Promise<ResponseDTO>;
}
