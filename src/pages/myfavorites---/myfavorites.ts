import { Component ,Injectable} from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { CardswipePage } from '../cardswipe/cardswipe';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { SigninPage } from '../signin/signin';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Appsetting } from '../../providers/appsetting';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeAudio } from '@ionic-native/native-audio';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'page-myfavorites',
  templateUrl: 'myfavorites.html'
})
@Injectable()
export class MyfavoritesPage {
  allProducts;
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
    public alertCtrl: AlertController,
    public appsetting: Appsetting,
    public toastCtrl: ToastController,
    public events: Events,
    public nav: Nav,
    public inappBrowser: InAppBrowser,
    private nativeAudio: NativeAudio,
    public media: Media,
    public file: File
  ) {
    //alert('update alert');
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
    this.setvarNow="playTrack";
    events.subscribe('page', (myFav) => {
      console.log(myFav);
      this.myFavs();
    })
  }
 protected resumeHalted = false;
    protected resumeSubject = new Subject<any>();
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


  /************ function for spotify login ****************/
  logSpotify() {
    if (!localStorage.getItem('code')) {
      var loginurl = 'https://accounts.spotify.com/authorize/?client_id=d1c1031c1b214739a9ba672e90cd2798&response_type=code&redirect_uri=https://rakesh.crystalbiltech.com&scope=';
      var target = '_self'
      var options = 'location=yes'
      var openspotify = this.inappBrowser.create(loginurl, target, options);
      console.log(loginurl);
      console.log(target);
      console.log(openspotify);
      openspotify.on('loadstart').subscribe((e) => {
        alert(e)
        console.log(e);
        let url = e.url;
        console.log(url);
        var redirect_uri = e.url.split('code=');
        console.log(redirect_uri);
        alert(redirect_uri[0]);
        if (redirect_uri[0] == 'https://rakesh.crystalbiltech.com/?') {
          let code = redirect_uri[1];
          alert('code--->' + code);
          console.log(code);
          localStorage.setItem('code', code);
          openspotify.close();
        }
      }, err => {
        console.log("InAppBrowser loadstart Event Error: " + err);
        alert(err)
      });

      openspotify.on('exit').subscribe((e) => {
        var code = localStorage.getItem('code');
        this.getToken(code);
      })
    } else {
      alert('token found');
      var code = localStorage.getItem('code');
      this.getToken(code);
    }

  }

  /********** function for get token from spotify ***********/
  private getToken(code) {

    alert('you are here ....');
    alert(code)
    var url: "https://accounts.spotify.com/api/token";
    this.http.get(this.appsetting.myGlobalVar + 'cities/spotifytoken').map(res => res.json()).subscribe(data => {
      alert('success');
      alert(JSON.stringify(data));
      this.getplaylist(data.access_token, data.token_type);
      // this.response = data.data;
    },
      err => {
        alert(JSON.stringify(err));
        alert('err' + JSON.stringify(err))
      })

  }

  /******** function for get playlist *****************/

  private getplaylist(token, tokentype) {
    alert(token);
    alert(tokentype);
    var url = "https://api.spotify.com/v1/users/mango_official/playlists/3KE0N6vRrsuPnIg0ciVHU5";
    var data = { 'token': token, 'token_type': tokentype, 'urld': url };
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    var serialized = this.serializeObj(data);
    this.http.post(this.appsetting.myGlobalVar + 'cities/spotifygetplaylist', serialized, options).map(res => res.json()).subscribe(data => {
      alert('success');
      alert(JSON.stringify(data));

    // this.tracks = data.tracks.items;
      for (var i = 0; i < data.tracks.items.length; i++) {
        if (data.tracks.items[i].track.preview_url != null) {
          this.tracks.push({
            'url': data.tracks.items[i].track.preview_url,
            'playing':false
            //  'title':data.tracks.items[i].track.name,
            //  'artist':data.tracks.items[i].artists[0].name
          });
        }
        //console.log(data.tracks.items[i].artists.length);
      }

      alert(JSON.stringify(this.tracks));
      this.currentTrack = this.tracks[0];
    },
      err => {
        alert(JSON.stringify(err));
        alert('err' + JSON.stringify(err))
      })
  }

  stopaudio() {
    if (this.audio.src) {
      this.audio.pause();
    }
  }



  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.myFavs();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  myFavs() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
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
            console.log(localStorage.getItem('USERID'));
            if (localStorage.getItem('USERID') == null) {
              this.navCtrl.push(TabsPage);
            }
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
      // closeButtonText: 'ok'
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
