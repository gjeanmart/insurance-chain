import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PolicyDetailsPage } from '../policy_details/policy_details';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
    
    public policies:Array<Object>;
    public loader:any;
 
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController) {
        
        this.loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
    }

    loadPolicies(){
        this.http.get('http://localhost:8080/api/v1/policy')
        .map((res: Response) => res.json())
        .subscribe((function(res){
            this.policies = res.policies;
        }).bind(this));
    }
    
    selectPolicy(policy) {
        console.log(policy);
        
        this.http.get('http://localhost:8080/api/v1/policy/'+policy.address)
        .map((res: Response) => res.json())
        .subscribe((function(res){
            policy.details = res.details;
            this.navCtrl.push(PolicyDetailsPage, policy);
        }).bind(this));
        
    }
    
    ionViewWillEnter() { 
        this.loadPolicies();
    }

    
}
