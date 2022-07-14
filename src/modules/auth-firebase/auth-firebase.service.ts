import { Injectable } from '@nestjs/common';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , getIdToken} from "firebase/auth";
import { initializeApp }  from 'firebase/app'; 

const firebaseConfig = {
    apiKey: "AIzaSyAyixPNxfsSzuzRsxjlfstldQF4oggTXCc",
    authDomain: "comvi-f7c64.firebaseapp.com",
    storageBucket: "comvi-f7c64.appspot.com",
    messagingSenderId: "912821513076"
};

const app = initializeApp(
    firebaseConfig
)

@Injectable()
export class AuthFirebaseService {

    constructor() {}

    async createUserInFirebaseProject(email:string, password: string) {       
       const created = await createUserWithEmailAndPassword(getAuth(app), email, password);
       return created;
    }

    async loginInFirebase (email: string, password:string){
        const userCredentials = await signInWithEmailAndPassword(getAuth(app), email, password);
        const token = getIdToken(userCredentials.user);
        return token;
    }
}
