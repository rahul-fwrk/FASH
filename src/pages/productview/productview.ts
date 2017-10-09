import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';


@Component({
  selector: 'page-productview',
  templateUrl: 'productview.html'
})



export class ProductviewPage {
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
  constructor(public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
    public media: Media,
    public file: File) {
      if(localStorage.getItem('currenttrack')){
        this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
        console.log(this.currentTrack);
        }
      this.setvarNow="playTrack";
  }

   productdetailsPage(){
   this.navCtrl.push(ProductdetailsPage);
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

}


