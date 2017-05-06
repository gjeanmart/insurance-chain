import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Auth, User, IDetailedError } from '@ionic/cloud-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    
    constructor(public auth: Auth, public user: User) {

    }
 
    public login(credentials) {
        
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        } 
        
        return Observable.create(observer => {
            this.auth.login('basic', credentials).then(() => {
                observer.next(true);
                observer.complete();
                this.user.save();
            }, (err: IDetailedError<string[]>) => {
                observer.error(true);("Error");
            });
        });
    }
 
    public register(userDetails) {
      
        if (userDetails.email === null || userDetails.password === null) {
            return Observable.throw("Please insert credentials");
        }

        return Observable.create(observer => {
            this.auth.signup({ 'email': userDetails.email, 'password': userDetails.password }).then(() => { 

                observer.next(true);
                observer.complete();
                
            }, (err: IDetailedError<string[]>) => {
                for (let e of err.details) {
                    if (e === 'conflict_email') {
                        return Observable.throw("mail already exists.");
                    } else {
                        return Observable.throw("Error");
                    }
                }
            });
        });
    }
    
    public updateUserInfo(userDetails) {

        return Observable.create(observer => {
            this.user.set('dob', userDetails.dob);
            this.user.set('gender', userDetails.gender);
            this.user.set('firstName', userDetails.firstName);
            this.user.set('surname', userDetails.surname);
            
            this.user.save().then(() => { 
                observer.next(true);
                observer.complete();
                
            }, (err: IDetailedError<string[]>) => {
                return Observable.throw("Error");
            });
        });
    }
 
    public getUserInfo() : User { 
        return this.user;
    }
 
    public logout() {
        
        return Observable.create(observer => {
            this.auth.logout();
            observer.next(true);
            observer.complete();
        });
    }
}