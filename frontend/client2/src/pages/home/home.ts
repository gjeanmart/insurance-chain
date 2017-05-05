import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    info = {};
  
    constructor(public app: App, private nav: NavController, private auth: AuthService) {
        this.info = this.auth.getUserInfo();
    }
 
    public logout() {
        this.auth.logout().subscribe(succ => {
            //this.nav.setRoot(LoginPage)
            //this.app.getRootNav().setRoot(LoginPage);
            this.nav.parent.parent.setRoot(LoginPage);
        });
    }

}
