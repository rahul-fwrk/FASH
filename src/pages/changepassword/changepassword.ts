import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { LoadingController, ToastController } from 'ionic-angular';
import { IonicPage, NavController,Nav, NavParams } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { Appsetting } from '../../providers/appsetting';

@Component({
	selector: 'page-changepassword',
	templateUrl: 'changepassword.html'
})
export class ChangepasswordPage {

	constructor(public navCtrl: NavController, public nav : Nav, public toastCtrl : ToastController, public appsetting: Appsetting, public loadingCtrl: LoadingController, public http: Http, public navParams: NavParams) {
//alert('ddd');
	}
	public data = '';
	public Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
		dismissOnPageChange: true
	});
	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}



	changePwd(userEmail) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var User: any = JSON.parse(localStorage.getItem("USER_DATA"));
		var email = User.data.User.email;
		console.log(email)
		console.log(userEmail)

		if (userEmail.value.newpassword == userEmail.value.conpassword) {
			var postdata = {
				email: email,
				old_password: userEmail.value.password,
				new_password: userEmail.value.newpassword
			};
			var serialized = this.serializeObj(postdata);
			console.log( postdata);
			this.Loader.present();

			this.http.post(this.appsetting.myGlobalVar + 'users/changepassword', serialized, options).map(res => res.json())
				.subscribe(data => {
					this.Loader.dismiss();
					console.log(" response" + JSON.stringify(data));
					this.data = data;
					console.log(this.data);
					if (data.isSucess == "true") {
						localStorage.clear();
						this.nav.setRoot(SigninPage);
						this.nav.popToRoot();
					}
					else {
						//alert(data.msg)
					}

				}, err => {

					console.log("Error");

					this.Loader.dismiss();
					console.log("Error!:");
				});

		} else {
			this.showToast('Passwords do not match');
		}

	}
  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      cssClass: 'toastCss',
      position: 'middle',
    });
    toast.present();
  }


}
