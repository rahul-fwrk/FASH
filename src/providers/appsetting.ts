import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Appsetting provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Appsetting {
audio:any;
 myGlobalVar: string = 'http://ec2-18-220-33-187.us-east-2.compute.amazonaws.com/api/';//'http://fashapp.io/api/';
  constructor(public http: Http) {
    console.log('Hello Appsetting Provider');
  }

}
