import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductcardPage } from '../productcard/productcard';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { CardswipePage } from '../cardswipe/cardswipe';
import { ProfilePage } from '../profile/profile';
// import { GenderPage } from '../gender/gender';
import { Events } from 'ionic-angular';
import { Media , MediaObject } from '@ionic-native/media';
import {BirthdayPage} from '../birthday/birthday';
import {ConfirmationPage} from '../confirmation/confirmation';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  profile;
  srcImage;
  response; IDtobe;profileimage;brandlink:any = 0;


  constructor(public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public events: Events,
    public navParams: NavParams,
    public media: Media
  
  ) {
 //  alert('new');
    if (this.navParams.get('checkout') == 'yes') {
      // refreshes the controller after checkout
      console.log('CHECKOUT');
      
    }
    console.log('YES UPDATED');
    if( localStorage.getItem("USERID")){
      this.image() // if a user is logged in
      this.srcImage = null;
    }
  
    this.lookbooklist();
    events.subscribe('homepage', (myFav) => {
      console.log(myFav);
      this.lookbooklist();
    })

   // this.mediaplay();
  }
  public lookbooklist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/listoflookbook'; 
    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
  
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/listoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
      console.log(data)
      for(var i=0;i<data.data.length;i++){
        if(data.data[i].Lookbook.brand){
           console.log(data.data[i].Lookbook.brand.search('http://'));
        var search = data.data[i].Lookbook.brand.search('http://');
        var searchhttps = data.data[i].Lookbook.brand.search('https://');
         if(search >= 0 || searchhttps >= 0){
             data.data[i].Lookbook.brandlink = 1;
              // value.Lookbook.image = value.Lookbook.brand;
               //data.data[i].Lookbook.brand = '';
            }else{
              data.data[i].Lookbook.brandlink = 0;
            }
        }
       
      }
      this.response = data.data;
      console.log(this.response);
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.image();
    this.lookbooklist();
    console.log('refreshed')
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  image() {
    //  alert(localStorage.getItem("USERID"))
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    // var url = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/productoflookbook'; 
    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
   // alert(JSON.stringify(postdata));
    this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
      console.log(data)
     // alert(JSON.stringify(data.data));
      if (data.data != null) {
        this.profile = data.data[0].User;
        this.profileimage = this.profile.image
      //  alert('profile Image---->'+this.profileimage);
      }

      //alert(this.srcImage)

      console.log(this.profile)

    })
    //})
  }
  
//   birthday(){
//     this.navCtrl.push(BirthdayPage);
//   }
  confirmation(){
 this.navCtrl.push(ConfirmationPage);
  }
  productcardPage(id) {
    var idTobe = id
    console.log(idTobe)
    localStorage.setItem('lookbookid', idTobe)
    this.navCtrl.push(ProductcardPage, { id: idTobe });
  }
  cardswipePage(id) {
    var idTobe = id
    console.log(idTobe)
    localStorage.setItem('lookbookid', idTobe)
    this.navCtrl.push(CardswipePage, { id: idTobe });
  }
  profilePage() {
    this.navCtrl.push(ProfilePage);
  }
  //   genderPage() {
  //   // alert("hit")
  //   this.navCtrl.push(GenderPage);
  //   // alert("hitjhj")
  // }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

}
