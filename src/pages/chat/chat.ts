import { Component, ViewChild, ContentChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, Content } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import { Appsetting } from '../../providers/appsetting';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  interval: any;isDisabled = false;scrollcard;
  @ViewChild(Content) content: Content;
 

  public Loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  chat_id; editedmsg; editedmsgid; username; typingdata; chatname;
  moment: any;
  data; userchat; listImages; time; loggeduser: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
  ) {
    this.chat_id = this.navParams.get('chat_id');
    this.chatname = this.navParams.get('name');
    console.log(this.chatname);
    this.showproductlist();
    
    /********** Code to refresh page after 1 second **************/
this.interval = setInterval(() => {
   this.content.scrollToBottom(300);
   this.chatshow();
  }, 1000);
    

    /***** end **********/
    var share_id = this.navParams.get('share_id');
    console.log(share_id)
    if (share_id) {
      console.log('Share\...........');
      this.shareImage(share_id);
    }
    this.editedmsg = null;
  }

  public back() {
   clearInterval(this.interval);
    this.navCtrl.push(FittingroomPage, { share_id: null ,support:'true'});
     
  }

  public chatshow() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    this.loggeduser = localStorage.getItem("USERID");
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var ddata = {
      friendid: this.chat_id,
      userid: user_id
    };
    console.log(ddata);
    var serialized = this.serializeObj(ddata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatlist', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.data != null) {
        for (var i = 0; i < data.data.length; i++) {
          var date = data.data[i].Chat.created;
          var d = moment(date).format('h:mm a');
          this.time = d;
         
          data.data[i].Chat.time = this.time;
          console.log(data.data[i][0].username);
          this.username = data.data[i][0].username;
        }
      }
      //this.ionViewDidLoad();
      this.userchat = data.data;

    })
  }


  public onetoone(message) {
    // alert(message)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/onetoonechat'; 
    var postdata = {
      friendid: this.chat_id,
      message: message,
      status: 1,
      single:1,
      userid: user_id,
      productid: ""
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);


    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/onetoonechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      this.chatshow()
      this.data = '';



    })
  }


  public shareImage(share_id) {
    // alert(share_id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/onetoonechat'; 
    var postdata = {
      friendid: this.chat_id,
      message: '',
      status: 0,
      userid: user_id,
      productid: share_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);


    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/onetoonechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      share_id = null;
      this.showproductlist()



    })
  }

  public showproductlist() {
    // alert("showproduct")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    var user_id = localStorage.getItem("USERID")
    var postdata = {
      friendid: this.chat_id,
      userid: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatliststatus', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      var share_id: null;
      if(data.data){
      for(var i=0;i<data.data.length;i++){
        console.log(data.data[i].Chat.productlike);
        if(data.data[i].Chat.productlike != null){
          this.isDisabled = true;
        }else{
          this.isDisabled = false;
        }
      }
      this.listImages = data.data.reverse();
      if(this.listImages.length > 0){
        this.scrollcard = 'scrollcard';
      }else{
        this.scrollcard = '';
      }
      }
    })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  presentActionSheet(msgid, msg, userid) {
    console.log(msgid);
    console.log(msg);
    console.log(userid);
    var user_id = localStorage.getItem("USERID")
    if (userid != user_id) {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Delete message',
            role: 'delete',
            handler: () => {
              console.log('delete clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              this.deleteMessage(msgid);


            }
          }
        ]
      });
      actionSheet.present();
    } else {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Delete message',
            role: 'delete',
            handler: () => {
              console.log('delete clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              this.deleteMessage(msgid);


            }
          }, {
            text: 'Edit message',
            role: 'edit',
            handler: () => {

              console.log('edit clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              this.data = this.editedmsg;

            }
          }
        ]
      });
      actionSheet.present();
    }

  }

  editedchat(editedmsg) {
    console.log(this.editedmsgid);
    console.log(editedmsg);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var postdata = {
      id: this.editedmsgid,
      message: editedmsg
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/editchat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        this.data = '';
        this.editedmsg = null;
        delete this.editedmsg;
        this.chatshow();
      } else {
        this.editedmsg = null;
        delete this.editedmsg;
        this.data = '';
        let toast = this.toastCtrl.create({
          message: 'Error in edit message! try again',
          duration: 3000
        });
        toast.present();

      }


    })

  }

  deleteMessage(msgid) {
    console.log(this.editedmsgid);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var postdata = {
      userid: user_id,
      id: msgid
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/deletechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        this.data = '';
        this.editedmsg = null;
        delete this.editedmsg;
        this.chatshow();
      } else {
        this.editedmsg = null;
        delete this.editedmsg;
        this.data = '';
        let toast = this.toastCtrl.create({
          message: 'Error in deleting message! try again',
          duration: 3000
        });
        toast.present();

      }


    })

  }

  /***********************function for product like dislike on chat */
  public likeDislikeProduct(proid, status) {
    console.log(proid);
    // alert(message)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    if (status == 1) {
      var postdata = {
        userid:user_id,
        id: proid,
        like: status
      };
      var serialized = this.serializeObj(postdata);
    } else {
      var postdata1 = {
        userid:user_id,
        id: proid,
        dislike: status
      };
      var serialized = this.serializeObj(postdata1);
    }
    console.log(postdata);
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/likedislikeproduct', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        this.showproductlist();
      }

    })
  }


  productPage(id) {
    this.navCtrl.push(ProductdetailsPage, { prod_id: id })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    // this.listImages = '';
    // this.userchat = '';
    // this.username = '';
    this.chatshow();
    this.showproductlist();
    console.log('refreshed')
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'You voted YES for Cabana Top!',
      cssClass: 'vote',
      buttons: ['OK']
    });
    alert.present();
  }

  showaAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'You voted NO for Cabana Top!',
      cssClass: 'vote',
      buttons: ['OK']
    });
    alert.present();
  }

}
