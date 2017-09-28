import { Component, Injectable } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { CardswipePage } from '../cardswipe/cardswipe';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { SigninPage } from '../signin/signin';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { File } from '@ionic-native/file';
import { Appsetting } from '../../providers/appsetting';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'page-myfavorites',
  templateUrl: 'myfavorites.html'
})
@Injectable()
export class MyfavoritesPage {
  allProducts; audio;
  tracks: any = [];
  playing: boolean = true;
  currentTrack: any;
  audioIndex;
  setvarNow: any;
  tracknow: boolean = true;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public appsetting: Appsetting,
    public toastCtrl: ToastController,
    public events: Events,
    public nav: Nav,

  ) {

    events.subscribe('page', (myFav) => {
      console.log(myFav);
      clearInterval(this.appsetting.interval);
      this.myFavs();
    })
  }
  protected resumeHalted = false;
  protected resumeSubject = new Subject<any>();

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.myFavs();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  myFavs() {
    clearInterval(this.appsetting.interval);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || user_id == undefined) {
      this.ConfirmUser();
    } else {
      var postdata = {
        userid: user_id,
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);

      var Loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfavourites', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data);
          if (data.status == 0) {
            this.allProducts = data.data;
          } else {
            this.allProducts = null;
            this.showToast('No products added to My Favorites yet');
          }
          this.events.publish('haveSeen', 'yes');
        })
    }
  }

  ConfirmUser() {
    let alert = this.alertCtrl.create({
      title: 'FASH',
      message: 'Please login to use this feature.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.push(TabsPage);
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.nav.setRoot(SigninPage);
            this.nav.popToRoot();
          }
        }
      ]
    });
    alert.present();
  }

  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2500,
      cssClass: 'toastCss',
      position: 'middle',
    });
    toast.present();
  }

  productDetails(i) {
    var id = i;
    console.log(id);
    this.navCtrl.push(ProductdetailsPage, { prod_id: id })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

}
