import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { AddpaymentPage } from '../addpayment/addpayment';
import { EditpaymentPage } from '../editpayment/editpayment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { MediaPlugin } from 'ionic-native';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  public card;
  public cards;
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
  constructor(public navCtrl: NavController,
       public http: Http,
       public appsetting: Appsetting,
       public loadingCtrl: LoadingController,
       public media: Media,
       public file: File ) {
        if(localStorage.getItem('currenttrack')){
          this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
          console.log(this.currentTrack);
          }
        this.setvarNow="playTrack";
    this.cardlist();
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

  public cardlist() {
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");
      var postData = {
        id: user_id
      }
      var serialized = this.serializeObj(postData);
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcardslist', serialized, options)
        .map(res => res.json())
        .subscribe(data => {
          Loading.dismiss();
          console.log(data);
          this.cards = data.data;
          console.log(this.cards)
          if (data.data.length == 0) {

          } else {
            let that = this;
            var i = 0;
            this.cards.forEach(function (value, key) {
             
              var num = value.Card.cardnumber;
              var last4 = num.slice(-4);
              var firstdigits = ' ';
              for (i = 0; i < (num.length - 4); i++) {
                firstdigits = firstdigits + 'x';
              }

              var final = firstdigits + last4
              console.log(final);
              value.Card.cardnumber = final;

            })
            
          }

        })
    }
  }

  editPayment(cardID){
    this.navCtrl.push(EditpaymentPage, { card_id : cardID });
  }
  addpaymentPage() {
    this.navCtrl.push(AddpaymentPage);
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
