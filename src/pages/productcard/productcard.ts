import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ProductviewPage } from '../productview/productview';
import { CardswipePage } from '../cardswipe/cardswipe';
import { TutorialPage } from '../tutorial/tutorial';
import 'rxjs/Rx';
import { Appsetting } from '../../providers/appsetting';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-productcard',
  templateUrl: 'productcard.html'
})
export class ProductcardPage {
  res;
  text;
  brand;
  name;orderhistory;
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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public media: Media,
    public file: File,
     private http: Http, public loadingCtrl: LoadingController, public appsetting: Appsetting) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";
    this.viewlookbook()
  }


  public viewlookbook() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var idd = localStorage.getItem('lookbookid')
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/listoflookbook'; 
    var postdata = {
      id: idd
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    // var Loading = this.loadingCtrl.create({
    //         spinner: 'hide',
    //         content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //       });
    //       Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
       // Loading.dismiss();
        console.log(data)
      
        this.res = data.data[0].Lookbook.image;
        this.name = data.data[0].Lookbook.name;
        this.brand = data.data[0].Lookbook.brand;
        this.text = data.data[0].Lookbook.text;
        console.log(this.res)


      }, err => {
       // Loading.dismiss();

      })
   // })


  }



  swipepage() {
    this.navCtrl.push(CardswipePage);
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

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  productviewPage() {
    this.navCtrl.push(ProductviewPage);
  }
  tutorialModal() {
    let modal = this.modalCtrl.create(TutorialPage);
    modal.present();
  }



}
