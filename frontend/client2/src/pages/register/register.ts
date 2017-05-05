import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
 
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    private registerForm : FormGroup;
    
    createSuccess = false;
    registerCredentials = { email: '', password: '' };
 
    constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private formBuilder: FormBuilder) {
        this.registerForm = this.formBuilder.group({
            firstName       : ['', Validators.compose([Validators.maxLength(30), Validators.required])],
            surname         : ['', Validators.compose([Validators.maxLength(100), Validators.required])],
            gender          : ['M', Validators.required],
            dob             : ['1990-01-01', Validators.required],
            email           : ['', Validators.required],
            password        : ['', Validators.required]
        });
    }
 
    public register() {

        let details = {
            'email'     : this.registerForm.value.email, 
            'password'  : this.registerForm.value.password, 
            'firstName' : this.registerForm.value.firstName, 
            'surname'   : this.registerForm.value.surname, 
            'gender'    : this.registerForm.value.gender, 
            'dob'       : this.registerForm.value.dob 
        };
        console.log(details);
    
        this.auth.register(details).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Account created.");
                
                this.auth.login(details).subscribe(allowed => {
                    if (allowed) {   
                        this.auth.updateUserInfo(details).subscribe(success => {
                            if (success) {
                                this.nav.setRoot(TabsPage);
                            } else {
                                this.showPopup("Error", "Unknown Problem ...");
                            }
                        }, error => {
                            this.showPopup("Error", "Unknown Problem ...");
                        });
                    
                    } else {
                        this.showPopup("Error", "Problem to log you...");
                    }
                }, error => {
                    this.showPopup("Error", "Problem to log you...");
                });
                
                
            } else {
                this.showPopup("Error", "Problem creating account.");
            }
        }, error => {
            this.showPopup("Error", error);
        });
    }
 
  showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [{
                text: 'OK',
                handler: data => {
                    if (this.createSuccess) {
                        this.nav.popToRoot();
                    }
                }
            }]
        });
        alert.present();
    }
}