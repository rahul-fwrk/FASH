import { Component } from '@angular/core';
import { NavController ,App} from 'ionic-angular';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { TermsPage } from '../terms/terms';
import { ReturnsPage } from '../returns/returns';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController,public app: App) {

  }
	public logout() {
		//alert("Logout")
		localStorage.clear();
		//this.navCtrl.push(SigninPage);
		this.app.getRootNav().setRoot(SigninPage);


	}
  privacypolicy(){
    this.navCtrl.push(PrivacypolicyPage);
  }
    termspolicy(){
    this.navCtrl.push(TermsPage);
  }
    reteturnpolicy(){
    this.navCtrl.push(ReturnsPage);
  }
}