// import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SharedServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SharedServiceProvider {

	public sendNotifEnabled: boolean = true;

  constructor(public http: Http) {
    console.log('Hello SharedServiceProvider Provider');
  }

}
