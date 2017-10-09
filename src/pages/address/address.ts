import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { EditaddressPage } from '../editaddress/editaddress';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { MediaPlugin } from 'ionic-native';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})
export class AddressPage {
  public addressList;
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
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
    public media: Media,
    public file: File
   // public toastCtrl: ToastController
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";
    this.AllAddresses();
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
  public AllAddresses() {
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
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userdeliveryaddresslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          this.addressList = data.data;
        }, err => {
          Loading.dismiss();

        })
    })
  }
    doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    delete this.addressList;
    this.AllAddresses();
    console.log('refreshed')
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }


  editAddress(id){

    this.navCtrl.push(EditaddressPage, { address_id : id});

  }
  addaddressPage() {
    this.navCtrl.push(AddaddressPage);
  }

}
