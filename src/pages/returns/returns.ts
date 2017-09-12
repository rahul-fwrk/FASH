import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';

@Component({
  selector: 'page-returns',
  templateUrl: 'returns.html'
})
export class ReturnsPage {
  content;
  constructor(public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
      public loadingCtrl:LoadingController

  ) {
    this.returnscontent();

  }

  returnscontent() {
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
      if (data.data) {
        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].Staticpage.position == 'return') {
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
