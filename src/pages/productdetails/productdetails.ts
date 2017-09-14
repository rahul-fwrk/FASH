import { Component, ViewChild, ViewChildren, } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController, AlertController } from 'ionic-angular';

import { CartmodelPage } from '../cartmodel/cartmodel';
import { ChatPage } from '../chat/chat';
import { CartPage } from '../cart/cart';
import { SigninPage } from '../signin/signin';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { Events, Slides } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { TutorialfavPage } from '../tutorialfav/tutorialfav';
import { TutorialfitPage } from '../tutorialfit/tutorialfit';
//import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html'
})



export class ProductdetailsPage {
  @ViewChild(Slides) slides: Slides; // for slide change event
  shownGroup = null;
  selectedSize = null;
  colorToShow = null;
  buttonBit = '0';
  sizeToShow = null;
  first;
  prod_id; showDetails; diseases; showImages; sizes = []; fav;
  sizemodal; allColors; allsizes;
  colorModal;isFirst;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public http: Http,
    public events: Events,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {

    var id = this.navParams.get('prod_id')
    console.log(id);
    this.details(id)
    this.events.subscribe('CartPage', () => {
      this.navCtrl.push(CartPage);
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
  showToast2(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      cssClass: 'toastCss',
      position: 'middle',
      // closeButtonText: 'ok'
    });
    toast.present();
  }


  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }


  public details(i) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var idd = localStorage.getItem('lookbookid')
    var user_id = localStorage.getItem('USERID');
    var postdata = {
      id: i,
      userid: user_id //'67'//
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productinfo', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log('data : ', data);
          if (data.status == 1) {
            this.showDetails = 1;
          } else {
            this.showDetails = data.data.Product;
            // this.showDetails.Price; //number:'{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}'
            this.showImages = data.data.Productimage;
            //this.isFirst = this.slides.isBeginning();
            this.sizes = data.data.Productsize;
            this.fav = data.data[0].favs;

            console.log('FAV', this.fav)
            var testarray = [];
            this.sizes.forEach(function (key, value) {
              if (testarray.indexOf(key.sizes) == -1) {
                testarray.push(key.sizes)
              }
            })
            console.log(testarray);
            var sorted = testarray.sort(function (a, b) { return a - b });  //use b-a for descending
            console.log(sorted)
            this.allsizes = sorted;
            console.log(this.allsizes)
            this.sizemodal = this.allsizes[0];
            console.log(this.sizemodal);
            this.getSize(this.sizemodal)
            this.diseases = [
              { title: "Product Information", description: this.showDetails.product_information },
              { title: "Return Policy", description: "When you place an order on FASH,  the     order will be fulfilled and shipped by the relevant merchant (also called a third party     seller), your return will be sent back to the seller instead of FASH. You can view the    Seller's return policy before you purchase an item by viewing the Returns and Refunds Policy section of the Seller's home page." },// this is static discription bcos i don't have data from backend.
           ];
          }
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })
  }


  myFavs(id) {
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser('Please login to use this feature.');
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
      var fav = this.fav
      if (fav == 1) {
        var status = 0
        console.log('UNFAV')
      } else {
        var status = 1
        console.log('FAV')
      }

      var postdata = {
        productid: this.showDetails.id,
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
      Loading.present().then(() => {
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/addtofavourite', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log(data);
          if (data.status == 0) {
            this.showToast(data.msg);
            console.log(data.bit)
            if (data.bit == 1) {
              this.events.publish('Liked', '1');
            } else {
              this.events.publish('Liked', '0');
            }

            var id = this.navParams.get('prod_id')
            this.details(id) // to recall function to update vals
          } else {
            this.showToast(data.msg);
          }
        }, err => {
          Loading.dismiss();
          this.showToast('Please try again.');
        })
      })
    }
  }


  ChangeSlide(to) {
    console.log(to);
    if (to == 'prev') {
      this.first = this.slides.isBeginning();
      console.log('first', this.first)
      if (!this.first) {
        this.slides.slidePrev();
      }
    } else {
      var last = this.slides.isEnd();
      console.log('last', last);
      if (!last) {
        this.slides.slideNext();
      }else if(last == true){
        this.lastslide();
        //alert('true last');
      //    this.first = this.slides.isBeginning();
      // console.log('first', this.first)
      // if (!this.first) {
      //   this.slides.slidePrev();
      // }
      }
    }
  }
lastslide(){
  this.ChangeSlide('next');
}
  AddToCart(name, id, sizeid, price,retailer) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser('Please login to add items to your cart');
    } else {
      var postdata = {
        productid: id,
        userid: user_id,
        quantity: '1',
        price: price,
        subtotal: price,
        productsizesid: sizeid,
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);

      var Loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        showBackdrop: false,
        cssClass: 'loader'
      });

      // return false;
      Loading.present().then(() => {
        this.http.post(this.appsetting.myGlobalVar + 'shop/fashaddtocart', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log(data);
          if (data.status == 0) {
            var name = this.showDetails.name;
            var price = this.showDetails.price;
            var img = this.showDetails.image;
            var size = this.sizeToShow;
            var color = this.colorToShow;
            console.log('sizetoshow', size);
            let modal = this.modalCtrl.create(CartmodelPage, { name: name, price: price, size: size, image: img, color: color, count: data.count ,retailername:retailer});
            modal.present();
          } else {
            this.showToast2('This product has already been added to your cart. Please increase product quantity at checkout.');
          }


        }, err => {

          Loading.dismiss();
          this.showToast('Please try again.');
        })
      })
    }
  }



  share(id) {
    console.log(id);
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser('Please login to use this feature.');
    } else {
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
        this.navCtrl.push(FittingroomPage, { share_id: id })
      //}
    }

  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };


  getColor(id) {
    console.log(id);
    this.selectedSize = id.id //sizeid;
    this.sizeToShow = id.sizes ///sizeName;
    this.colorToShow = id.colors;
    this.buttonBit = this.selectedSize;
    console.log(this.buttonBit);
  }


  getSize(size) {
    console.log('selected size ', size);
    var testarray1 = []
    this.sizes.forEach(function (value, key) {
      if (value.sizes == size) {

        testarray1.push(value);
      }
    })
    // console.log(testarray1);
    this.allColors = testarray1;
    console.log(this.allColors);
    this.colorModal = this.allColors[0];
    this.getColor(this.colorModal);
    // console.log(this.allColors);
  }


  ConfirmUser(msg) {
    let alert = this.alertCtrl.create({
      title: 'FASH',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            alert.dismiss();
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

customersupport(){
this.navCtrl.push(FittingroomPage);
}
  cartmodelModal(id, price, name,retailer) {
    var size = this.selectedSize;
    console.log('product id : ', id, 'price :', price, 'size :', size);
    if (size != null) {
      this.AddToCart(name, id, size, price,retailer);
    } else {
      console.log('Select a size')
      this.showToast('Please select a color and size');
    }
  }

}


