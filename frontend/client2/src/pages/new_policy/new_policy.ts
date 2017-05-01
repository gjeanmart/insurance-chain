import { Component } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HistoryPage } from '../history/history';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-new_policy',
  templateUrl: 'new_policy.html'
})
export class NewPolicyPage {
    
    private newPolicyForm : FormGroup;

    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController, private formBuilder: FormBuilder) {
        
        this.newPolicyForm = this.formBuilder.group({
            firstName       : ['', Validators.compose([Validators.maxLength(30), Validators.required])],
            surname         : ['', Validators.compose([Validators.maxLength(100), Validators.required])],
            gender          : ['', Validators.required],
            dob             : ['', Validators.required],
            email           : ['', Validators.required],
            departureDate   : ['', Validators.required],
            from            : ['', Validators.required],
            to              : ['', Validators.required],
            flightNo        : ['', Validators.required],
            cardNumber      : ['', Validators.required],
            expiryMonth     : ['', Validators.required],
            expiryYear      : ['', Validators.required],
            cvc             : ['', Validators.required]
        });
    }

    
    submitPolicy() {

        let successNotif = this.alertCtrl.create({
          title: 'Policy submitted',
          subTitle: 'Your new flightAssure policy has been submitted. You should receive a confirmation email in a few minutes.',
          buttons: [{
              text: 'OK',
              handler: data => {
                this.newPolicyForm.reset();
                this.navCtrl.push(HistoryPage);
              }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        (<any>window).Stripe.card.createToken({
            "number"      : this.newPolicyForm.value.cardNumber,
            "exp_month"   : this.newPolicyForm.value.expiryMonth,
            "exp_year"    : this.newPolicyForm.value.expiryYear,
            "cvc"         : this.newPolicyForm.value.cvc
        }, (status: number, response: any) => {
            if (status === 200) {
                console.log(response.card);
                
                var policy = {
                    "owner"     : {
                        "firstName"     : this.newPolicyForm.value.firstName,
                        "surname"       : this.newPolicyForm.value.surname,
                        "gender"        : this.newPolicyForm.value.gender,
                        "dob"           : this.newPolicyForm.value.dob,
                        "email"         : this.newPolicyForm.value.email
                    },
                    "flight"        : {
                        "from"          : this.newPolicyForm.value.from,
                        "to"            : this.newPolicyForm.value.to,
                        "flightNo"      : this.newPolicyForm.value.flightNo,
                        "departureDate" : this.newPolicyForm.value.departureDate
                    },
                    "payment"       : {
                        "token"         : response.id
                    }
                };
 
                
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');
                this.http.post('http://localhost:8080/api/v1/proposal', policy)
                .map((res: Response) => res.json())
                .subscribe(function(res){
                    console.log(res);
                    loader.dismiss();
                    successNotif.present();
                });
                
            } else {
                console.log(response.error.message);
                loader.dismiss();
            }
        });
        
        
    }

}
