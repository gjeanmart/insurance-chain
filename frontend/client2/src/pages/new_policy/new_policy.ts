import { Component } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-new_policy',
  templateUrl: 'new_policy.html'
})
export class NewPolicyPage {

    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController) {
    
    }
    
    policy = {
        owner : {},
        flight: {},
        payment: {}
    }
    payment = {
        cardNumber: null,
        expiryMonth: null,
        expiryYear: null,
        cvc: null,
        
    };
    
    submitPolicy() {
        console.log(this.policy)
        console.log(this.payment)
        
        let successNotif = this.alertCtrl.create({
          title: 'Policy submitted',
          subTitle: 'Your new flightAssure policy has been submitted. You should receive a confirmation email in a few minutes.',
          buttons: [{
              text: 'OK',
              handler: data => {
                this.navCtrl.push(HomePage);
              }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        (<any>window).Stripe.card.createToken({
            "number"      : this.payment.cardNumber,
            "exp_month"   : this.payment.expiryMonth,
            "exp_year"    : this.payment.expiryYear,
            "cvc"         : this.payment.cvc
        }, (status: number, response: any) => {
            if (status === 200) {
                console.log(response.card)
                
                this.policy.payment = {
                    token: response.id
                };
                
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');
                this.http.post('http://localhost:8080/api/v1/proposal', this.policy)
                .map((res: Response) => res.json())
                .subscribe(function(res){
                    console.log(res);
                    loader.dismiss();
                    successNotif.present();
                    
                });
                
            } else {
                console.log(response.error.message)
                loader.dismiss();
            }
        });
        
    }

}
