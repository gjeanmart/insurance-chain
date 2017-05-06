import { Component }                            from '@angular/core';
import { NavController, AlertController }       from 'ionic-angular';
import { LoadingController }                    from 'ionic-angular';
import { AuthService }                          from '../../providers/auth-service';
import { Validators, FormBuilder, FormGroup }   from '@angular/forms';
import { User } from '@ionic/cloud-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
    private settingsForm : FormGroup;
    

    constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private formBuilder: FormBuilder, public user: User, public loadingCtrl: LoadingController) {
        this.loadUserInfo();
    }
    
    ionViewWillEnter() { 
        this.loadUserInfo();
    }

    loadUserInfo(){
        this.user = this.auth.getUserInfo();
        
        this.settingsForm = this.formBuilder.group({
            firstName       : [this.user.data.data['firstName'], Validators.compose([Validators.maxLength(30), Validators.required])],
            surname         : [this.user.data.data['surname'], Validators.compose([Validators.maxLength(100), Validators.required])],
            gender          : [this.user.data.data['gender'], Validators.required],
            dob             : [this.user.data.data['dob'], Validators.required],
            email           : [this.user.details.email, Validators.required]
        });
    }
    
    update() {
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        let details = {
            'dob'       : this.settingsForm.value.dob,
            'gender'    : this.settingsForm.value.gender,
            'firstName' : this.settingsForm.value.firstName,
            'surname'   : this.settingsForm.value.surname,
        }
        
        this.auth.updateUserInfo(details).subscribe(success => {
            loader.dismiss();
            if (success) {
                this.showPopup("Success", "Account updated.");
            } else {
                this.showPopup("Error", "Unknown Problem ...");
            }
        }, error => {
            loader.dismiss();
            this.showPopup("Error", "Unknown Problem ...");
        });
    }
    
    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [{
                text: 'OK',
                handler: data => {
                    
                }
            }]
        });
        alert.present();
    }
 
}