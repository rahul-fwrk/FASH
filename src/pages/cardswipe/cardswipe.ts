import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController, AlertController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { TabsPage } from '../tabs/tabs';
import { SigninPage } from '../signin/signin';
import { ToastController } from 'ionic-angular';
import { ProductdetailsPage } from '../productdetails/productdetails'; //
import { TutorialfavPage } from '../tutorialfav/tutorialfav';
import { TutorialfitPage } from '../tutorialfit/tutorialfit';
import { SportyfyPage } from '../sportyfy/sportyfy';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { NativeAudio } from '@ionic-native/native-audio';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import 'rxjs/Rx';
import { Events } from 'ionic-angular';
import { Slides } from 'ionic-angular';

// import {
//   StackConfig,
//   Stack,
//   Card,
//   ThrowEvent,
//   DragEvent,
//   SwingStackComponent,
//   SwingCardComponent
// } from 'angular2-swing';

@Component({
  selector: 'page-cardswipe',
  templateUrl: 'cardswipe.html'
})

export class CardswipePage {
  // @ViewChild('myswing1') swingStack: SwingStackComponent;
  // @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
  @ViewChild(Slides) slides: Slides; // for slide change event


  cards: Array<any>;
  lastItem;artist:any;
  //stackConfig: StackConfig;
  recentCard: string = '';
  resLength: any;
  index;
  bit:boolean = true;
  allcards: any = [];
  allLookbookIDs;
  lastProductofLookbook;
  selectedItem;
  nextLookbook_id;
  alreadyPushed// check if u need this
  lengthofLoookbook;brandlink;

  tracks: any = [];
  playing: boolean = true;
  currentTrack: any;
title: any;
  audioIndex;
  setvarNow: any;
  tracknow: boolean = true;
  //
  res;
  text;
  brand;
  name;
  constructor(
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public events: Events,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
     private nativeAudio: NativeAudio,
    public media: Media,
    public file: File
  ) {

    var swipe_status = JSON.parse(localStorage.getItem('swipe_status'));
     console.log('firsttime swipe', swipe_status);
    // if (swipe_status != 1) {
    //   this.tutorialModal()
    //   localStorage.setItem('swipe_status', '1');
    // }
    
    var idd: any = localStorage.getItem('lookbookid')
    this.viewfrontPage(idd);
    this.viewlookbook();
    this.lookbooklist();

  }


  public lookbooklist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    this.http.get(this.appsetting.myGlobalVar + 'lookbooks/lookbooksid', options)
      .map(res => res.json()).subscribe(data => {

        console.log('allLookbookids', data)
        this.allLookbookIDs = data.data;

      }, err => {

      })
  }



  //isEnd()
  ondrag() {
    // let activeIndex = this.slides.getActiveIndex();
    var length = this.slides.length();
    console.log(length);
    // var length1 = this.lengthofLoookbook;
    console.log('ONdrag currentLookbook', this.nextLookbook_id)
    if (this.nextLookbook_id == undefined) {
      var currentLookbook_id: any = localStorage.getItem('lookbookid');
    } else {
      var currentLookbook_id: any = this.nextLookbook_id;
    }
    let aa = this;
    let data = this.allLookbookIDs;

    var first = this.slides.isBeginning()
    var last = this.slides.isEnd()
    // console.log('Is First? ' ,first);
    console.log('Is Last', last);
    if (last == true) {
      this.allLookbookIDs.forEach(function (value, $index) {
        if (value.Lookbook.id == currentLookbook_id) {
          var next_lookbook_INDEX = $index + 1;
          console.log('currentLookbook_id', currentLookbook_id)
          //alert(JSON.stringify(data[next_lookbook_INDEX]));
            if(data[next_lookbook_INDEX].Lookbook != undefined){
                aa.nextLookbook_id = data[next_lookbook_INDEX].Lookbook.id
            } else {
               this.showToast('Sorry, there is no data available.')
            }
        
          // console.log('nextLookbook_id ',aa.nextLookbook_id)
        }
      });
      this.nextLookbook_id = aa.nextLookbook_id;
      console.log('nextLookbook_id', this.nextLookbook_id);
      this.viewNextfrontPage(this.nextLookbook_id);
    }
  }

  // Connected through HTML
  voteUp(like: boolean, index: number) {
    let removedCard = this.allcards.pop();
    console.log(this.allcards)
  }


  public viewfrontPage(idd) {
    var aa = this;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/listoflookbook'; 
    var postdata = {
      id: idd
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        let allcards: any = this.allcards;
            if(localStorage.getItem('accessToken') && localStorage.getItem('tokenType')){
    //  alert(localStorage.getItem('accessToken'));
      var accessToken = localStorage.getItem('accessToken');
     // alert('tokenType');
     // alert(localStorage.getItem('tokenType'));
      var tokenType = localStorage.getItem('tokenType');
      
    }
        data.data.forEach(function (value, key) {
          console.log(value);
        //  alert(value.Lookbook.playlist);
          aa.getplaylist(accessToken,tokenType,value.Lookbook.playlist);
          if(value.Lookbook.brand != null){
            var search = value.Lookbook.brand.search('http://');
            var searchhttps = value.Lookbook.brand.search('https://');
           if(search >= 0 || searchhttps >= 0){
             aa.brandlink = 1;
              // value.Lookbook.image = value.Lookbook.brand;
              // value.Lookbook.brand = '';
            }else{
              aa.brandlink = 0;
            }
          }
          allcards.push(value)
        })
        this.allcards = allcards;
        console.log('withnewfrontcover', this.allcards)
      }, err => {
        Loading.dismiss();

      })
    })
  }

  public viewNextfrontPage(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });


    var idd: any = this.nextLookbook_id;

    var postdata = {
      id: idd
    };
    // console.log(postdata);
    var serialized = this.serializeObj(postdata);


    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageoflookbook', serialized, options).map(res => res.json()).subscribe(data => {

      let allcards: any = this.allcards;
      //console.log('front COVER:- ',this.allcards);
      data.data.forEach(function (value, key) {
        allcards.push(value)
      })
      this.allcards = allcards;
      console.log('NEXT COVER', this.allcards)
      this.Nextlookbook(this.nextLookbook_id);

    }, err => {

    })

  }


  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      cssClass: 'toastCss',
      position: 'middle',
      // closeButtonText: 'ok'
    });
    toast.present();
  }


  //our api
  public viewlookbook() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var idd = localStorage.getItem('lookbookid');
    var uid = localStorage.getItem('USERID')
    var postdata = {
      lookbookid: idd,
      userid: uid,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          // console.log('our data : ', data);
          if (data.status == 0) {

            // this.allcards = data.data;  //for front page
            let allcards = this.allcards
            data.data.forEach(function (value, key) {
              allcards.push(value);
            })

            this.allcards = allcards;
            console.log('VIEW LOOK BOOK', this.allcards);
            this.lastItem = this.allcards[this.allcards.length - 1];
            this.lengthofLoookbook = this.lastItem;
            this.lastProductofLookbook = this.lastItem.Product.id
            // this.allcards.push(this.lengthofLoookbook);
            // console.log('Last Item', this.lastItem);
          } else {
            this.showToast('Sorry, no products available')
          }
        }, err => {
          Loading.dismiss();
        })
    });
  }

  public Nextlookbook(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    // var idd = localStorage.getItem('lookbookid');
    var uid = localStorage.getItem('USERID')
    var postdata = {
      lookbookid: id,
      userid: uid,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Loading new lookbook...',
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();

        // console.log('our data : ', data);
        if (data.status == 0) {
          console.log('old', this.allcards)
          let allcards = this.allcards
          data.data.forEach(function (value, key) {
            allcards.push(value);
          });
          this.allcards = allcards;
          console.log('updated', this.allcards);
          // this.lastItem = this.allcards[this.allcards.length - 1];
          // this.lengthofLoookbook = this.lastItem;
          // this.lastProductofLookbook = this.lastItem.Product.id
          // console.log('Last Item', this.lastItem);
        } else {
          this.showToast('Sorry, no products available')
        }
      }, err => {
        Loading.dismiss();
      })
    });
  }


  public Lastlookbook(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    // var idd = localStorage.getItem('lookbookid');
    var uid = localStorage.getItem('USERID')
    var postdata = {
      lookbookid: id,
      userid: uid,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Loading previous lookbook...'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();

        console.log('our data : ', data);
        if (data.status == 0) {
          console.log('old', this.allcards)
          let allcards = this.allcards
          data.data.forEach(function (value, key) {
            allcards.push(value);
          });
          this.allcards = allcards;
          console.log('updated', this.allcards);
        } else {
          this.showToast('Sorry, no products available')
        }
      }, err => {
        Loading.dismiss();
      })
    });
  }


  tutorialModal() {
    let modal = this.modalCtrl.create(TutorialPage);
    modal.present();
  }



  myFavs(id, fav) {

    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser();
    } else {

     // var firsTime = JSON.parse(localStorage.getItem('favourite_status'));
      // if (firsTime == 0) {
      //   let modal = this.modalCtrl.create(TutorialfavPage);
      //   modal.present();
      //   modal.onDidDismiss(data => {
      //     localStorage.setItem('favourite_status', '1')
      //   })
      // }
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      let options = new RequestOptions({ headers: headers });
      if (fav == 1) {
        var status = 0
        console.log('UNFAV')
      } else {
        var status = 1
        console.log('FAV')
      }
      var postdata = {
        productid: id,
        userid: user_id,
        status: status
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);

      var Loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        showBackdrop: false,
        cssClass: 'loader'
      });

      // return false;
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/addtofavourite', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();

        console.log(data)
        if (data.status == 0) {
          this.showToast('');
          console.log(data.bit)
          if (data.bit == 1) {
            
            this.showToast(data.msg);
            this.events.publish('Liked', '2');  // only for the stacks, so that Red dot remains in the next card
          } else {
            this.events.publish('Liked', '0');
          }
        } else {
          this.showToast(data.msg);
        }


      })
    }
  }


  share(id) {
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser();
    } else {
    console.log(id);
    var fit: any = JSON.parse(localStorage.getItem('fitting_status'));
    console.log('statata', fit)
    // if (fit == 0) {
    //   let modal = this.modalCtrl.create(TutorialfitPage);
    //   modal.present();
    //   modal.onDidDismiss(data => {
    //     localStorage.setItem('fitting_status', '1')
    //     this.navCtrl.push(FittingroomPage, { share_id: id })
    //   })

    // } else {
      this.navCtrl.push(FittingroomPage, { share_id: id ,sharebit:1})
    }
   // }
  }

  ConfirmUser() {
    let alert = this.alertCtrl.create({
      title: 'Fash',
      message: 'Please login to use this feature.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.push(SigninPage);
          }
        }
      ]
    });
    alert.present();
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


  playTrack(track){
    if(localStorage.getItem('code')){
    this.bit = true;
        // First stop any currently playing tracks
        for(let checkTrack of this.tracks){
            if(checkTrack.playing){
                this.pauseTrack(checkTrack);
                const file: MediaObject = this.media.create(checkTrack.url);
                this.appsetting.audio = file;
            }
        }

        track.playing = true;
       
        this.currentTrack = track;
        const file: MediaObject = this.media.create(this.currentTrack.url);
        this.appsetting.audio = file;
       // alert('starts')
        this.appsetting.audio.play();
        this.appsetting.audio.onSuccess.subscribe(() => {
         // alert("onSuccess");
          if(this.tracknow==true){
              this.nexttTrack();
          }
        },err=>{
           //   alert('next unsuccessful');
        })
          }else{
              let confirm = this.alertCtrl.create({
      title: 'FASH',
      message: 'Please login with spotify to play lookbook track',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            confirm.dismiss();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.push(SportyfyPage);
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
          }
    }
 
    pauseTrack(track){
        track.playing = false;
        this.appsetting.audio.pause();
        this.currentTrack = track;
    }
  pausetyTrack(track){
    this.bit = false;
        track.playing = false;
        this.appsetting.audio.pause();
        this.currentTrack = track;
    }

  nexttTrack(){
        let index = this.tracks.indexOf(this.currentTrack);
        index >= this.tracks.length - 1 ? index = 0 : index++;
        this.playTrack(this.tracks[index]);
    }

    nextTrack(){
        this.setvarNow = "nextTrack";
        let index = this.tracks.indexOf(this.currentTrack);
        index >= this.tracks.length - 1 ? index = 0 : index++;
        this.playTrack(this.tracks[index]);
    }
 
    prevTrack(){
        this.setvarNow = "prevTrack";
        let index = this.tracks.indexOf(this.currentTrack);
        index > 0 ? index-- : index = this.tracks.length - 1;
        this.playTrack(this.tracks[index]);
    }

    stopaudio(){
      //alert('stop');
      if(this.appsetting.audio){
            this.tracknow = false;
      this.appsetting.audio.stop();
      this.appsetting.audio.release();
      this.navCtrl.push(TabsPage);
      }else{
        this.navCtrl.push(TabsPage);
      }
  
    }
  /******** function for get playlist *****************/

  public getplaylist(token, tokentype,urldata) {
   // alert(token);
  //  alert(tokentype);
   // alert(urldata);
    var url = urldata;//"https://api.spotify.com/v1/users/mango_official/playlists/3KE0N6vRrsuPnIg0ciVHU5";
    var data = { 'token': token, 'token_type': tokentype, 'urld': urldata };
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
   // alert(JSON.stringify(data));
    var serialized = this.serializeObj(data);
    this.http.post(this.appsetting.myGlobalVar + 'cities/spotifygetplaylist', serialized, options).map(res => res.json()).subscribe(data => {
     // alert('success');
     // alert(JSON.stringify(data));

    // this.tracks = data.tracks.items;
      for (var i = 0; i < data.tracks.items.length; i++) {
        // alert(data.tracks.items[i].track.name);
        // alert('artist name');
        // alert(data.tracks.items[i].track.artists[i].name);
        if (data.tracks.items[i].track.preview_url != null) {
          this.tracks.push({
            'url': data.tracks.items[i].track.preview_url,
            'playing':false,
            'title':data.tracks.items[i].track.name,
            'artist':data.tracks.items[i].track.artists[0].name
          });
        }
      }
      this.currentTrack = this.tracks[0];
      this.playTrack(this.currentTrack);
     // alert(JSON.stringify(this.tracks));
    },
      err => {

       // alert(JSON.stringify(err));
       // alert('err' + JSON.stringify(err))

      })
  }

}