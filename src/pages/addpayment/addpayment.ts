import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CardPage } from '../card/card';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';


@Component({
  selector: 'page-addpayment',
  templateUrl: 'addpayment.html'
})
export class AddpaymentPage {
  card: any = {};
  defaultcardstatus=0;
  default;
  countries; 
  /********** variables for music player **********/
  index;
  bit: boolean = true;
  tracks: any = [];
  playing: boolean = true;
  currentTrack: any;
  title: any;
  audioIndex;
  setvarNow: any;
  tracknow: boolean = true;
  audurl; audio;playsong:any = 0;
  constructor(  public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
    public media: Media,
    public file: File
  ) {
  // alert('now updated');
  if(localStorage.getItem('currenttrack')){
    this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
    console.log(this.currentTrack);
    }
  this.setvarNow="playTrack";
    this.countrylist();
  }

countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data;
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.card.country = localStorage.getItem('country')
        }else{
          this.card.country = 'US';
        }
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

dateFormat(date){
  console.log(date);
  if(date.length == 2){
      this.card.mmyy = date+'/';
    }
}
   cardFormat(number) {
    console.log(number);
    if (number.length == 4) {
      this.card.cardnumber = number + '-';

    } else if (number.length == 9) {
      this.card.cardnumber = number + '-';
    }else if (number.length == 14) {
      this.card.cardnumber = number + '-';
    }
  }
contactFormat(number){
  console.log(number);
  if(number.length == 3){
      this.card.contact = number+'-'
  } else if (number.length == 7){
      this.card.contact = number+'-';
  }
}

showToast(msg){ 
    var toast = this.toastCtrl.create({
              message: msg,
              duration: 2000,
              cssClass: 'toastCss',
              position: 'middle',
              // closeButtonText: 'ok'
    });
    toast.present();
}


public add_card(formdata) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var apt;
    if(formdata.value.apt != null){
      apt = formdata.value.apt;
    }else{
      apt = '';
    }
    var cardno = formdata.value.cardnumber.split('-');
  
    cardno = cardno[0]+cardno[1]+cardno[2]+cardno[3];
    var postdata = {
      uid: user_id,
      name: formdata.value.name,
      cardnumber: cardno,
      mmyy: formdata.value.mmyy,
      cvc:'', //formdata.value.cvc,
      username: formdata.value.username,
      address: formdata.value.address,
      apt: apt,
      status : 0,
      defaultcardstatus : this.defaultcardstatus,
      country: formdata.value.country,
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zip,
      contact_number: formdata.value.contact
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    console.log(serialized);

   // return false;
    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcards', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          // this.addressList = data.data;
          this.navCtrl.push(CardPage); 
        }, err=>{
           Loading.dismiss();
           this.showToast('Oops. Something went wrong.');
        })
      })
 
}

// http://rakesh.crystalbiltech.com/fash/api/shop/useraddcards
  setDefault(value){
      console.log(value)
      if(value == true){
        this.default = true;
        this.defaultcardstatus = 1
        console.log(this.defaultcardstatus)
      } else {
        this.defaultcardstatus = 0
        this.default = false;
      }
  }

serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
}


 cardPage(){
    this.navCtrl.push(CardPage);
  }

}
