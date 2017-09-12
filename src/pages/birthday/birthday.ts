import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { SportyfyPage } from '../sportyfy/sportyfy';

@Component({
  selector: 'page-birthday',
  templateUrl: 'birthday.html'
})
//Rahul maurya
export class BirthdayPage {
  data1:any = {};
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting
  ) {
    console.log('data1')
    //userdetails
    if (localStorage.getItem('userfbdata') != null || localStorage.getItem('userfbdata') != undefined) {
      var usedata = JSON.parse(localStorage.getItem('userfbdata'));
      this.data1 = {
        fname: usedata.first_name,
        lname: usedata.last_name,
        email: usedata.email,
        number: "",
        gender: usedata.gender,
      }
    } else {
      var user = JSON.parse(localStorage.getItem('USER_DATA'));
      var userdata = user.data.User;
      console.log('here', user);
      this.data1 = {
        fname: userdata.first_name,
        lname: userdata.last_name,
        email: userdata.email,
        number: "",
        gender: userdata.gender,
      }
    }
  }

  skip() {
    this.navCtrl.push(TabsPage);
  }

  updateAge(dob) {
    console.log('DATE->', dob);

    //return false;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });

    var user_id = localStorage.getItem('USERID');
    var usedata = JSON.parse(localStorage.getItem('userfbdata'));
    if (usedata == null || usedata == undefined) {
      var user = JSON.parse(localStorage.getItem('USER_DATA'));
      var userdata = user.data.User;
      console.log('here', userdata);
      if(userdata.last_name == null){
        userdata.last_name = '';
      } else if (userdata.gender == null){
        userdata.gender = '';
      }
      this.data1 = {
        first_name: userdata.first_name,
        last_name: userdata.last_name,
        email: userdata.email,
        phone: '',
        dob: dob,
        address: '',
        cards: "",
        state_in: '',
        gender: userdata.gender,
        id: user_id,
      }
    } else {
      if(usedata.last_name == null){
        userdata.last_name = '';
      } else if (usedata.gender == null){
        usedata.gender = '';
      }
      this.data1 = {
        first_name: usedata.first_name,
        last_name: usedata.last_name,
        email: usedata.email,
        phone: '',
        dob: dob,
        address: '',
        cards: "",
        state_in: '',
        gender: usedata.gender,
        id: user_id,
      };
    }

    console.log('postdata', this.data1)
    var serialized = this.serializeObj(this.data1);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'users/editprofile', serialized, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          Loading.dismiss();
          if (data.isSucess == "true") {
            // let toast = this.toastCtrl.create({
            //   message: "Profile is updated",
            //   duration: 2000,
            //   cssClass: 'toastCss',
            //   position: 'middle',

            // });
            // toast.present();
            this.navCtrl.push(TabsPage);
          } else {

          }
        }, err => {
          Loading.dismiss()
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

