import { inject, Injectable } from '@angular/core';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { UiService } from './ui-service';
import { Role, User } from '../models/auth.models';
import { UserService } from './user-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    uiService = inject(UiService);
    userService = inject(UserService)

    registerUser(email: string, password: string) {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential: { user: any }) => {
                this.processIsLoggedIn(userCredential.user);
                this.userService.addUser(auth);
            })
            .catch((error: { code: any; message: any }) => {
                //TODO add error handling
            });
    }

    loginUser(email: string, password: string) {
        this.uiService.setIsLoading(true)
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential: { user: any }) => {
                // Signed in
                this.processIsLoggedIn(userCredential.user);
                this.uiService.setIsLoading(false)
            })
            .catch((error: { code: any; message: any }) => {
                this.uiService.setIsLoading(false)
                //TODO add error handling
            });
    }

    logoutUser() {
        this.uiService.setIsLoading(true)
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                this.processIsNotLoggedIn();
                this.uiService.setIsLoading(false)
            })
            .catch((error) => {
                this.uiService.setIsLoading(false)
                //TODO add error handling
            });
    }

    processIsLoggedIn(user: { email: any; uid: any }) {
        if (user.email) {
            let currentUser: User = {
                email: user.email,
                uid: user.uid,
                role: Role.User,
            };
            this.userService.userAtFirebaseAuth.set(currentUser);
            this.userService.getUserData(currentUser);
        }
    }

    processIsNotLoggedIn() {
        this.userService.logOut()

    }
}
