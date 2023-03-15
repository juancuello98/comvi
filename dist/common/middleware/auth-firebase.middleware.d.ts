import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare const firebaseParams: {
    private_key: string;
    client_email: string;
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};
export declare class AuthFirebaseMiddleware implements NestMiddleware {
    private readonly logger;
    private defatulApp;
    constructor();
    use(req: Request, res: Response, next: () => void): Promise<void>;
    accessDenied(url: string, res: Response): void;
}
