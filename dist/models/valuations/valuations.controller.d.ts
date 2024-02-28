import { ValuationsService } from './valuations.service';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { RequestHelper } from 'src/common/helpers/http/request.helper';
export declare class ValuationsController {
    private readonly valuationsService;
    private readonly requestHelper;
    constructor(valuationsService: ValuationsService, requestHelper: RequestHelper);
    create(createValuationDto: CreateValuationDto): Promise<void>;
}
