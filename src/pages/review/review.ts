import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfirmationPage } from '../confirmation/confirmation';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile'; 
import { PaymentPage } from '../payment/payment';
import { CartPage } from '../cart/cart';
import { TabsPage } from '../tabs/tabs';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-review',
  templateUrl: 'review.html'
})

export class ReviewPage {
  cartItems; subtotal;total; tax;
  trackingid; ship_id; token; bill_id; card_id;
  allProductids: any = [];
/********** variables for music player **********/
    index;
    tracks: any = [];
    bit: boolean = true;
    // tracks: any = [];
    playing: boolean = true;
    currentTrack: any;
    title: any;
    audioIndex;
    setvarNow: any;
    tracknow: boolean = true;
    audurl; audio;playsong:any = 0;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
    public navParams: NavParams,
    public media: Media,
    public file: File
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";

    this.ReviewCart();
    this.ship_id = this.navParams.get('ship_id');
    this.token = this.navParams.get('token');
    this.bill_id = this.navParams.get('bill_id');
    this.card_id = this.navParams.get('card_id');
    console.log(this.ship_id + ' ' + this.token + " " + this.card_id);
  }

  public ReviewCart() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var postdata = {
      id: user_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcartslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log('Cartdata : ', data);
          this.cartItems = data.data;
          // find the subtotal
          var total = 0;
          for (var i = 0; i < this.cartItems.length; i++) {
            var product = this.cartItems[i].Cart;
            total += (parseFloat(product.price) * (product.quantity));
          }
          console.log(total)
          this.subtotal = total;

          this.tax = ((8.9/100)*this.subtotal); //tax 8.9%
          this.total = this.subtotal+ this.tax;

          let that = this;
          this.cartItems.forEach(function (value, key) {
            var productid = value.Cart.id
            that.allProductids.push(productid)

          })
          var arraytostring = that.allProductids.toString()
          this.allProductids = arraytostring;
          console.log(this.allProductids);


        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })
  }

/************ function for play audio ********/
playTrack(track) {
  console.log(track);
  this.bit = true;
  var aa = this;
  if(this.appsetting.audio != undefined)
    {
      this.currentTrack = track;
      this.appsetting.audio.play();
    }else{
      track.loaded = true;
      track.playing = true;
      this.currentTrack = track;
      const file: MediaObject = this.media.create(this.currentTrack.music);
      localStorage.setItem('currenttrack',JSON.stringify(this.currentTrack));
      this.appsetting.audio = file;
      this.appsetting.audio.play();
    }

  this.appsetting.audio.onSuccess.subscribe(() => {
  if (this.tracknow == true) {
    //localStorage.setItem('currenttrack',this.currentTrack);
      this.nexttTrack();
    }
  }, err => {
  })

}

pauseTrack(track) {
  track.playing = false;
  this.appsetting.audio.pause();
  this.currentTrack = track;
}

pausetyTrack(track) {
  this.bit = false;
  track.playing = false;
  this.appsetting.audio.pause();
  this.currentTrack = track;
}

nexttTrack() {
  let index = this.appsetting.tracks.indexOf(this.currentTrack);
  index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
  this.appsetting.audio=undefined;
  this.playTrack(this.appsetting.tracks[index]);
}

nextTrack() {
  this.setvarNow = "nextTrack";
  let index = this.appsetting.tracks.indexOf(this.currentTrack);
  index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
  this.appsetting.audio=undefined;
  this.playTrack(this.appsetting.tracks[index]);
}

prevTrack() {
  this.setvarNow = "prevTrack";
  let index = this.appsetting.tracks.indexOf(this.currentTrack);
  index > 0 ? index-- : index = this.appsetting.tracks.length - 1;
  this.appsetting.audio=undefined;
  this.playTrack(this.appsetting.tracks[index]);
}

  payment() {
    var user_id = localStorage.getItem('USERID');
    var user_data = JSON.parse(localStorage.getItem("USER_DATA"))
    var USERemail = user_data.data.User.email;
    this.ship_id = this.navParams.get('ship_id');
    this.token = this.navParams.get('token');
    this.bill_id = this.navParams.get('bill_id');
    this.card_id = this.navParams.get('card_id');

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    var postdata = {
      test: this.token,
      price: this.total,
      email: USERemail
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
   // alert(JSON.stringify(postdata));
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/stripe', postdata, options)
        .map(res => res.json()).subscribe(data => {
        //  alert('strip success');
          console.log('stripe response', data);
          Loading.dismiss();
          this.trackingid = data.id;
          this.checkout();
        }, err => {
        //  alert('strip error');
        //  alert(JSON.stringify(err));
          Loading.dismiss();
          this.showToast('Payment is unsuccessful');
        })
    })
  }

  checkout() {
    var user_id = localStorage.getItem('USERID');
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var checkoutData = {
      userid: user_id,
      billingid: this.bill_id,
      addressid: this.ship_id,
      cartid: this.allProductids,  //array of CarT ids converted into string
      subtotal: this.subtotal, //this.token,
      tax: '0',
      total: this.total,
      trackingid: this.trackingid,
    };

    console.log(checkoutData);
//alert(JSON.stringify(checkoutData));
    var serializedData = this.serializeObj(checkoutData);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/checkout', serializedData, options)
        .map(res => res.json()).subscribe(response => {
          Loading.dismiss();
          console.log(response);
          if (response.status == 0) {
            this.showToast('Payment is successful');
            this.navCtrl.push(ConfirmationPage, { order_id: response.data.trackingid });
          }
        }, err => {
         // alert('checkout error');
         // alert(JSON.stringify(err));
          Loading.dismiss();
          this.showToast('Error. Checkout process was not successful.');
        })
    })
  }


  cancelCheckout() {
    //alert('cancel checkout');
    this.navCtrl.push(CartPage);
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
  
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }

  confirmPage() {
    this.navCtrl.push(ConfirmationPage);
  }

}
