import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {
content;
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
  public http:Http,
  public appsetting:Appsetting,
  public loadingCtrl:LoadingController,
  public media: Media,
  public file: File
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";
    this.termscontent();
  }

  termscontent(){
        let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
     var Loading = this.loadingCtrl.create({
            spinner: 'bubbles',
          });
          Loading.present().then(() => {
    this.http.get(this.appsetting.myGlobalVar + 'Staticpages/pageslist', options).map(res => res.json()).subscribe(data => {
      console.log(data)
       Loading.dismiss();
      if(data.data){
 for(var i=0;i<data.data.length;i++){
    if(data.data[i].Staticpage.position == "terms"){
      this.content = data.data[i].Staticpage;
    }
  }
      }
 console.log(this.content);
    })
  })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
