import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestHelper } from '../../common/helpers/http/request.helper';
import { Request } from 'express';
import { RequestService } from './request.service';
import { NewRequestDTO } from './dto/new-request.dto';
import { ChangeStatusOfRequestDTO } from './dto/change-status-request.dto';
import { TransactionService } from '../transactions/transaction.service';
export declare class RequestController {
    private readonly requestService;
    private readonly requestHelper;
    private readonly transaction;
    constructor(requestService: RequestService, requestHelper: RequestHelper, transaction: TransactionService);
    create(tripRequest: NewRequestDTO, request: Request): Promise<ResponseDTO>;
    AcceptRequest(action: ChangeStatusOfRequestDTO, request: Request): Promise<ResponseDTO>;
    RejectRequest(action: ChangeStatusOfRequestDTO, request: Request): Promise<ResponseDTO>;
    CancelRequest(action: ChangeStatusOfRequestDTO, request: Request): Promise<ResponseDTO>;
    findMyRequests(request: Request): Promise<ResponseDTO>;
    requestsByTrips(request: Request): Promise<ResponseDTO>;
}
