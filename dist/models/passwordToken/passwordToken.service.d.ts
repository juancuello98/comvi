import { Model } from 'mongoose';
import { PasswordToken, PasswordTokenDocument } from './passwordToken.schema';
export declare class PasswordTokenService {
    private readonly passwordTokenModel;
    constructor(passwordTokenModel: Model<PasswordTokenDocument>);
    GenerateToken(): PasswordToken;
    IsExpired(token: PasswordToken): boolean;
    private generateRandomString;
}
