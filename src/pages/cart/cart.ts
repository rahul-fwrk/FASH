import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShippingPage } from '../shipping/shipping';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
    cartItems;subtotal;
    tax; total;
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
    public media: Media,
    public file: File
  ) {
//alert('sdfsd');
if(localStorage.getItem('currenttrack')){
  this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
  console.log(this.currentTrack);
  }
this.setvarNow="playTrack";
 clearInterval(this.appsetting.interval);
      this.ViewCart();

   }

   doRefresh(refresher) {
    console.log('Begin async operation', refresher);
     this.ViewCart();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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


  public ViewCart() {
    clearInterval(this.appsetting.interval);
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
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcartslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log('Cartdata : ', data);
          this.cartItems = data.data;
          
          // find the subtotal
          var total = 0;
          for(var i = 0; i < this.cartItems.length; i++){
                var product = this.cartItems[i].Cart;
                total += (parseFloat(product.price) * (product.quantity) );
          }
          console.log(total)
          this.subtotal = total;
          this.tax = ((8.9/100)*this.subtotal); ////tax 8.9%
          this.total = this.subtotal+ this.tax;

        }, err=>{
          Loading.dismiss();
           this.showToast('Oops. Something went wrong.');
        })
      })
  }

  removeItem(cart_id){
    console.log(cart_id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      id: cart_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/removecartproducts', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          if(data.status == 0){
             console.log('Decreased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast(data.msg);
          }

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }


  Increase(qty, id){
    console.log(qty, id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      cartid: id,
      status: 1, //for increase, 0 for decrease
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/increasedecreasequantity', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          if(data.status == 0){
             console.log('Increased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast(data.msg);
          }
        

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }


  Decrease(qty, id){
    console.log(qty, id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      cartid: id,
      status: 0, //for increase, 0 for decrease
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/increasedecreasequantity', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

      
          if(data.status == 0){
             console.log('Decreased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast('Please remove product by clicking the remove button on the product image.');
          }

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }

  showToast(msg){ 
    var toast = this.toastCtrl.create({
              message: msg,
              duration: 2500,
              cssClass: 'toastCss',
              position: 'middle',
              // closeButtonText: 'ok'
    });
    toast.present();
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }


  shippingPage(){
    this.navCtrl.push(ShippingPage);
  }

}
