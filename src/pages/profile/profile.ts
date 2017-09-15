import { Component } from '@angular/core';
import { NavController, App, Nav } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { SigninPage } from '../signin/signin';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { EditprofilePage } from '../editprofile/editprofile';
import { SettingPage } from '../setting/setting';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { ChatPage } from '../chat/chat';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	public fbstats = '';
	country;
	profile;
	city; user_id;

	imageTosend;
	srcImage: string;
	public CameraPopoverOptions;
	public imgTosend; finalImg: '';

	constructor(public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		public http: Http,
		public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private socialSharing: SocialSharing,
		public app: App,
		public nav: Nav,
		private facebook: Facebook,
	) {
		//	alert('jjjj');

		if (localStorage.getItem("USERID")) {
			this.user_id = localStorage.getItem("USERID");
			console.log(this.user_id)
			this.profilePage()
			this.fbstats = localStorage.getItem('fabuser');
		}

		this.country = localStorage.getItem('country')
		this.city = localStorage.getItem('city')
	}

	public Loader = this.loadingCtrl.create({
		spinner: 'bubbles'
	});



	CameraAction() {
		console.log('opening');
		let actionsheet = this.actionSheetCtrl.create({
			title: "Choose Album",
			buttons: [{
				text: 'Camera',
				handler: () => {
					this.Loader.present();
					const options: CameraOptions = {
						quality: 5,
						sourceType: 1,
						targetWidth: 800,
						allowEdit: true,
						targetHeight: 800,
						correctOrientation: true,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}
					this.camera.getPicture(options).then((imageUri) => {
						this.Loader.dismiss();
						this.srcImage = 'data:image/jpeg;base64,' + imageUri;
						//this.imgTosend = imageUri;
						//	alert(imageUri);
						let headers = new Headers();
						headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
						let options = new RequestOptions({ headers: headers });
						var user_id = localStorage.getItem("USERID");
						var postdata = {
							id: user_id,
							img: imageUri
						};
						console.log(postdata);
						//alert(JSON.stringify(postdata));
						var serialized = this.serializeObj(postdata);
						var Loading = this.loadingCtrl.create({
							spinner: 'bubbles'
						});
						Loading.present().then(() => {
							this.http.post(this.appsetting.myGlobalVar + 'users/saveimage', serialized, options).map(res => res.json()).subscribe(data => {
								Loading.dismiss();
								console.log(data);
							})
						}, err => {
							Loading.dismiss();
							//	alert(JSON.stringify(err));
						})

					}, (err) => {
						this.Loader.dismiss();
						//alert(JSON.stringify(err));
						console.log(err);
					});
				}
			},
			{
				text: 'Gallery',
				handler: () => {
					console.log("Gallery Clicked");
					//alert("get Picture")
					this.Loader.present();
					const options: CameraOptions = {
						quality: 5,
						sourceType: 0,
						targetWidth: 800,
						targetHeight: 800,
						allowEdit: true,
						correctOrientation: true,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}

					this.camera.getPicture(options).then((imageData) => {
						console.log(imageData);
						this.Loader.dismiss();
						//	alert(imageData);
						this.srcImage = 'data:image/jpeg;base64,' + imageData;
						//this.imgTosend = imageData;
						//this.Loader.dismiss();
						let headers = new Headers();
						headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
						let options = new RequestOptions({ headers: headers });
						var user_id = localStorage.getItem("USERID");
						var postdata = {
							id: user_id,
							img: imageData
						};
						console.log(postdata);
						//	alert(JSON.stringify(postdata));
						var serialized = this.serializeObj(postdata);
						var Loading = this.loadingCtrl.create({
							spinner: 'bubbles'
						});
						Loading.present().then(() => {
							this.http.post(this.appsetting.myGlobalVar + 'users/saveimage', serialized, options).map(res => res.json()).subscribe(data => {
								Loading.dismiss();
								console.log(data);
							})
						}, err => {
							Loading.dismiss();
							//alert(JSON.stringify(err));
						})
					}, (err) => {
						this.Loader.dismiss();
						//alert(JSON.stringify(err));
						// Handle error
					});
				}
			},
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
					//  actionsheet.dismiss();

				}
			}]
		});

		actionsheet.present();
	}
	profilePage() {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var user_id = localStorage.getItem("USERID");
		var postdata = {
			id: user_id
		};
		console.log(postdata);
		var serialized = this.serializeObj(postdata);
		// alert(JSON.stringify(postdata));
		this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
			console.log(data);
			this.profile = data.data[0].User;
			this.srcImage = this.profile.image;
			console.log(this.profile);
			//	alert(JSON.stringify(this.profile));

		})
	}

	login() {
		this.nav.popToRoot();
	}

	socailsharing() {
		this.socialSharing.share("invite friend", null, null, "http://google.com")
			.then(() => {
				//alert("success");
			},
			() => {
				//	alert("failed");
			})
	}


	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}


	public logout() {
		if (localStorage.getItem('logIn_role') == 'FB') {
			this.facebookLogout();
		} else {
			localStorage.clear();
			//this.navCtrl.push(SigninPage);
			this.app.getRootNav().setRoot(SigninPage);
		}
	}

	facebookLogout() {
		this.facebook.logout().then((sucess) => {
			//alert('facebook logout successfull');
			localStorage.clear();
			this.app.getRootNav().setRoot(SigninPage);
		}).catch((error) => {
			//alert('facebook logout unsuccessful');
			//alert(JSON.stringify(error));
		})
	}
	doRefresh(refresher) {
		console.log('Begin async operation', refresher);
		delete this.profile;
		delete this.srcImage;
		this.profilePage();
		console.log('refreshed')
		setTimeout(() => {
			console.log('Async operation has ended');
			refresher.complete();
		}, 2000);
	}
	orderhistoryPage() {
		this.navCtrl.push(OrderhistoryPage);
	}
	editprofilePage() {
		this.navCtrl.push(EditprofilePage);
	}
	settingPage() {
		this.navCtrl.push(SettingPage);
	}
	changepasswordPage() {
		this.navCtrl.push(ChangepasswordPage);
	}
	chatPage() {
		this.navCtrl.push(FittingroomPage);
	}

}
