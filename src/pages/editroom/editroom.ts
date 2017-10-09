import { Component } from '@angular/core';
import {NavController, LoadingController, AlertController } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { Appsetting } from '../../providers/appsetting';
import { Http, Headers, RequestOptions } from '@angular/http';
import {ChatPage} from '../chat/chat';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-editroom',
  templateUrl: 'editroom.html'
})
export class EditroomPage {
public friendslist:any = [];time;status;share_id;
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
    public appsetting:Appsetting,
    private http:Http,
    public media: Media,
    public file: File
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";
this.friendlist();
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

  /************function for getting friends list*********** */
public friendlist() {
    // alert("start")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
        //  Loading.dismiss();
          console.log(data)
          if(data.data != null){
          for (var i = 0; i < data.data.length; i++) {
            var date = data.data[i].Accept.created;
            var d = new Date(date);
            var hh = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            console.log('hours:' + hh); console.log("minute:" + m); console.log('seconds:' + s);
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh - 12;
              dd = "PM";
            }
            if (h == 0) {
              h = 12;
            }
            console.log(h + ':' + m + ' ' + dd);
            this.time = h + ':' + m + ' ' + dd;
            data.data[i].Accept.time = this.time;
            console.log(data.data[i].Accept.isgroup);
            if (data.data[i].Accept.isgroup != 0) {
              console.log('if');
             
            
            }else if(data.data[i].Accept.groupid == user_id){
              console.log('else if');
               data.data[i].Users.time = this.time;
              this.friendslist.push(data.data[i].Users);
            
            } else {
              console.log('else');
              data.data[i].User.time = this.time;
              this.friendslist.push(data.data[i].User);
             
            }

          }
          }
          console.log(this.friendslist);

        })
        

  
  // });
  }

  chatPage(id) {
    var shareid = this.share_id;
    this.navCtrl.push(ChatPage, { chat_id: id, share_id: shareid });
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

searchPage(){
    this.navCtrl.push(SearchPage);
  }

}
