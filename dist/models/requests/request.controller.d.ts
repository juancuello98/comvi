import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestHelper } from '../../common/helpers/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
export declare class RequestController {
    private readonly requestService;
    private readonly requestHelper;
    constructor(requestService: RequestService, requestHelper: RequestHelper);
    create(tripRequest: NewRequestDTO, request: Request): Promise<ResponseDTO>;
}
