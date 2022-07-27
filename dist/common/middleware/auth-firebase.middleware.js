"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthFirebaseMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFirebaseMiddleware = exports.firebaseParams = void 0;
const common_1 = require("@nestjs/common");
const serviceAccountJson = require("../../authentication/auth-firebase/firebaseServiceAccount.json");
const firebase = require("firebase-admin");
const common_2 = require("@nestjs/common");
exports.firebaseParams = {
    private_key: serviceAccountJson.private_key,
    client_email: serviceAccountJson.client_email,
    apiKey: "AIzaSyAyixPNxfsSzuzRsxjlfstldQF4oggTXCc",
    authDomain: "comvi-f7c64.firebaseapp.com",
    projectId: "comvi-f7c64",
    storageBucket: "comvi-f7c64.appspot.com",
    messagingSenderId: "912821513076",
    appId: "1:912821513076:web:a9ae28dc73db9b48c6da21",
    measurementId: "G-3HT7L8SV8D"
};
let AuthFirebaseMiddleware = AuthFirebaseMiddleware_1 = class AuthFirebaseMiddleware {
    constructor() {
        this.logger = new common_2.Logger(AuthFirebaseMiddleware_1.name);
        this.defatulApp = firebase.initializeApp({
            credential: firebase.credential.cert(exports.firebaseParams),
        });
    }
    async use(req, res, next) {
        const token = req.headers.authorization;
        if (token && token != '') {
            try {
                const decodedToken = await this.defatulApp
                    .auth()
                    .verifyIdToken(token.replace('Bearer ', ''));
                const user = decodedToken.email;
                req['user'] = user;
                this.logger.log('Firebase Authentication Toke Validated: ', req);
                next();
            }
            catch (error) {
                this.logger.log('Auth Firebase Middleware Failed: ', error);
                this.accessDenied(req.url, res);
            }
        }
        else {
            next();
        }
    }
    accessDenied(url, res) {
        res.status(403).json({
            statusCode: 403,
            timestamp: new Date().toISOString(),
            path: url,
            message: 'Access Denied: Firebase Authentication'
        });
    }
};
AuthFirebaseMiddleware = AuthFirebaseMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthFirebaseMiddleware);
exports.AuthFirebaseMiddleware = AuthFirebaseMiddleware;
//# sourceMappingURL=auth-firebase.middleware.js.map