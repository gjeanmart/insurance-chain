import { Component }                from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';


export class Policy {
    address         : string;
    departureDate   : Date;
    flightNo        : string;
    owner           : string;
    state           : string;
    details         : Object;
}

@Component({
  selector: 'page-policy_details',
  templateUrl: 'policy_details.html'
})
export class PolicyDetailsPage {
    
    
    public policy:Policy;
    
    constructor(public navCtrl: NavController, private navParams: NavParams) {
        this.policy = navParams.data;
    }

}