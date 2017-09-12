import { Component } from '@angular/core';
import { NavController, NavParams ,ToastController,Nav,Events} from 'ionic-angular';
import { EditroomPage } from '../editroom/editroom';
import { SearchPage } from '../search/search';
import { ChatPage } from '../chat/chat';
import { TutorialchatPage } from '../tutorialchat/tutorialchat';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { CreategroupPage } from '../creategroup/creategroup';
import { GroupchatPage } from '../groupchat/groupchat';
import { SigninPage } from '../signin/signin';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment'; // provides moment-style pipes for date formatting
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'page-fittingroom',
  templateUrl: 'fittingroom.html'
})
export class FittingroomPage {

  userimage: any = []; status; slug; data; share_id = null; datadate;
  accepteduser; time; groupdata: any = []; newusers: any = []; searchArray; username;
  errorValue = '2';
  moment: any;
  fit: any;
  sharebit;
  dPipe = new DatePipe('en-US');

  constructor(
    public navCtrl: NavController,
    public nav: Nav,
    public navParams: NavParams,
    public http: Http,
        public events: Events,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController

  ) {
    events.subscribe('page2', (res) => {
      console.log(res);
       if(localStorage.getItem("USERID")){
         delete this.accepteduser;
         this.groupdata = [];
         this.userimage = [];
      this.showuserlist();
    }else{
      this.ConfirmUser();
     // this.showToast('Please login to use this feature');
    }
      
    })
    this.fit = JSON.parse(localStorage.getItem('fitting_status'));
     if (this.fit == 0) {
        localStorage.setItem('fitting_status', '1')
    }
    console.log('UPDATE  !! !!')
   
    
    if(this.navParams.get('sharebit')){
      this.sharebit = this.navParams.get('sharebit');
    }
    this.share_id = this.navParams.get('share_id');
    console.log('fitting room, prod id', this.share_id);
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
         
              this.navCtrl.push(TabsPage);
           
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


  public showuserlist() {
    // alert("start")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/userslist'; 

    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    //  var Loading = this.loadingCtrl.create({
    //     spinner: 'hide',
    //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //   });
    //   Loading.present().then(() => {
    this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
      //this.Loading.dismiss();
      console.log(data)
      this.status = data.data[0].User.fitting_status;
      console.log(this.status)
      // alert(this.status)
      if (this.status == "1") {
        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
          //  Loading.dismiss();
          console.log(data)

          console.log('herereeee');
          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
              var date = data.data[i].Accept.created;
              // var date = data.data[i].Accept.created;
              var d = moment(date).format('h:mm a');
              this.time = d;
              if (data.data[i].Accept.isgroup != 0) {
                data.data[i].Accept.time = this.time;
                this.groupdata.push(data.data[i]);
                this.chatlist();
              } else if (data.data[i].Accept.groupid == user_id) {
                console.log('else if');
                 data.data[i].Accept.time = this.time;
                this.userimage.push(data.data[i].Users);
                localStorage.setItem('friendlist', JSON.stringify(this.userimage));
                this.chatlist();
              } else {
                console.log('else');
                data.data[i].Accept.time = this.time;
                this.userimage.push(data.data[i].User);
                localStorage.setItem('friendlist', JSON.stringify(this.userimage));
                this.chatlist();
              }
              console.log('here rahul');
              console.log(data.data[i].Accept.created);
              // this.datadate = new Date(data.data[i].Accept.created);
              // console.log(this.datadate);
            }
          }
          // console.log(this.userimage);
          // console.log(this.groupdata);

        })


      } else {
        console.log();
        // this.navCtrl.push(TutorialchatPage);
        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);

        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
          // Loading.dismiss();
          console.log(data)
          if (data.data != null) {
            console.log('herereeee');
            for (var i = 0; i < data.data.length; i++) {
              console.log(data.data[i][0].date);
              if(data.data[i][0].date != null){
                var date = data.data[i][0].date;//data.data[i].Accept.created;
                var d = moment(date).format('h:mm a');
                this.time = d;
                
              }
              if (data.data[i].Accept.isgroup != 0) {
                data.data[i].Accept.time = this.time;
                console.log('IM HERE IF->', data.data[i])
                this.groupdata.push(data.data[i]);
                this.chatlist();
              } else if (data.data[i].Accept.groupid == user_id) {
                data.data[i].Users.lastmessage = data.data[i][0].message;
                 
                data.data[i].Users.time = this.time;
                console.log('IM HERE ELSE IF->', this.time)
                this.userimage.push(data.data[i].Users);
                console.log('ALL DATA 1', this.userimage)

                this.chatlist();
              } else {
                data.data[i].Accept.time = this.time;
                data.data[i].User.lastmessage = data.data[i][0].message;
              
               // console.log('IM HERE ELSE->', this.time)
                this.userimage.push(data.data[i].User);
                console.log('ALL DATA 2', this.userimage)
              }
            }
          }
          console.log(this.userimage);
          // console.log(this.groupdata);
        })

        this.chatlist();
      }
    })
    // });
  }

  public accpet(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");

      var postdata = {
        status: 0,
        groupid: user_id,
        userid: id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      //  var Loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
      // });
      // Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/acceptdecline', serialized, options).map(res => res.json()).subscribe(data => {
        //Loading.dismiss();
        console.log(data)
        if (data.data != null) {
          this.userimage = [];
          console.log('accepted');
        } else {
          this.userimage = [];
          console.log('decline');
        }
        this.userimage = [];
        delete this.accepteduser;
        this.showuserlist();
        this.chatlist();
      })
      //  });

    }
  }

  public decline(idd) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    var postdata = {
      status: 1,
      groupid: user_id,
      userid: idd
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    // var Loading = this.loadingCtrl.create({
    //     spinner: 'hide',
    //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //   });
    //   Loading.present().then(() => {
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/acceptdecline', serialized, options).map(res => res.json()).subscribe(data => {
      // Loading.dismiss();
      console.log(data)
      this.userimage = [];
      delete this.accepteduser;
      this.showuserlist();
      this.chatlist();

    })
    //})
  }

  chatlist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");

      var postdata = {
        userid: user_id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      // var Loading = this.loadingCtrl.create({
      //     spinner: 'hide',
      //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
      //   });
      //   Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/receivedinvitationlistfittingroom', serialized, options).map(res => res.json()).subscribe(data => {
        // Loading.dismiss();
        console.log('new data ->',data)
        if (data.status == 0) {
          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
                  var date = data.data[i].Accept.created;
                  var d = moment(date).format('h:mm a');
                  this.time = d;
                  data.data[i].Accept.time = this.time;
            }

          }
          this.accepteduser = data.data;

        }
        //alert(data.msg)

      })
      //  })
    }
  }

  // used to filter the list
  setFilteredItems() {
    console.log(this.data);
    var keyword = this.data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
    console.log(keyword);
    console.log(keyword.length);

    if (keyword.length == 0) {
      console.log('plz write something');
      this.errorValue = '2';
      console.log(this.errorValue);
    } else {

      this.searchArray = this.filterItems(keyword);
      console.log('Filtering');
      this.errorValue = '0';
      console.log(this.errorValue);
    }
  }



  filterItems(searchTerm) {
    console.log('searchTerm.... ' + searchTerm);
    console.log(this.userimage);
    if (this.userimage != undefined) {
      return this.userimage.filter((userlist) => {
        if (userlist.first_name != null) {
          return userlist.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }

      });
    }

  }
  // end filter


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.userimage = [];
    this.groupdata = [];
    delete this.accepteduser;
    this.showuserlist();
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


  editPage() {
    this.navCtrl.push(EditroomPage);
  }

  searchPage() {
    this.navCtrl.push(SearchPage);
  }
  creategroupPage() {
    this.navCtrl.push(CreategroupPage);
  }
  groupchatPage(id) {
    var shareid = this.share_id;
    this.navCtrl.push(GroupchatPage, { chat_id: id, share_id: shareid });
  }
  chatPage(id, name) {
    this.username = name;
    var shareid = this.share_id;
    this.navCtrl.push(ChatPage, { chat_id: id, share_id: shareid, name: this.username });
  }

}