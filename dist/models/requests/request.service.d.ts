import { Model } from 'mongoose';
import { ResponseDTO } from 'src/common/interfaces/responses.interface';
import { RequestDocument } from './request.schema';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ExtendedRequestDTO } from './dto/extended-request.dto';
export declare class RequestService {
    private readonly requestModel;
    private readonly responseHelper;
    private readonly logger;
    constructor(requestModel: Model<RequestDocument>, responseHelper: ResponseHelper);
    findByStatus(status: string): Promise<ResponseDTO>;
    findAll(email: string): Promise<ResponseDTO>;
    findById(requestId: string): Promise<ResponseDTO>;
    create(req: ExtendedRequestDTO): Promise<ResponseDTO>;
    update(request: RequestDocument): Promise<RequestDocument>;
}
