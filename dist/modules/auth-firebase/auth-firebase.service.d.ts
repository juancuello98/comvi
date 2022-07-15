export declare class AuthFirebaseService {
    constructor();
    createUserInFirebaseProject(email: string, password: string): Promise<import("@firebase/auth").UserCredential>;
    loginInFirebase(email: string, password: string): Promise<string>;
}
