import { Injectable, NestMiddleware } from '@nestjs/common';
import * as serviceAccountJson from '../../authentication/auth-firebase/firebaseServiceAccount.json';
import * as firebase from 'firebase-admin';
import {Request, Response } from 'express';
import { Logger } from '@nestjs/common';


export const firebaseParams = {
  private_key : serviceAccountJson.private_key,
  client_email: serviceAccountJson.client_email,
  apiKey: "AIzaSyAyixPNxfsSzuzRsxjlfstldQF4oggTXCc",
  authDomain: "comvi-f7c64.firebaseapp.com",
  projectId: "comvi-f7c64",
  storageBucket: "comvi-f7c64.appspot.com",
  messagingSenderId: "912821513076",
  appId: "1:912821513076:web:a9ae28dc73db9b48c6da21",
  measurementId: "G-3HT7L8SV8D"
};

@Injectable()
export class AuthFirebaseMiddleware implements NestMiddleware {

  private readonly logger = new Logger(AuthFirebaseMiddleware.name);
  private defatulApp: any;

  constructor() {
    this.defatulApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseParams),
    });
  }
  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;

    if (token && token != '') {
      try {
        const decodedToken = await this.defatulApp
          .auth()
          .verifyIdToken(token.replace('Bearer ', ''));
        const user = decodedToken.email;
        req['user'] = user;
        this.logger.log('Firebase Authentication Toke Validated: ', req)
        next();
      } catch (error) {
        this.logger.log('Auth Firebase Middleware Failed: ', error);
        this.accessDenied(req.url, res);
      }
    } else {
      next();
    }
  }

  accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied: Firebase Authentication'
    })
  }
}
