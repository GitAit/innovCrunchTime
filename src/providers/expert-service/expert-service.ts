// import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the ExpertServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExpertServiceProvider {

  // apiUrl="http://uca-notes.uca.local/uca_notes/innovCrunchTime/";
  // apiUrl="https://brave-bobcat-45.localtunnel.me/uca_notes/innovCrunchTime/";
  apiUrl="https://ucastudent.uca.ma/innovCrunchTime/";

  expertsUrl=this.apiUrl+"Experts.php";

	public data: any;

  constructor(public http: Http) {
    // console.log('Hello ExpertServiceProvider Provider');
  }

  load() {

    return Observable.create(observer => {
	    this.http.get(this.expertsUrl)
	      .map(res => res.json())
	      .subscribe(data => {
	        // we've got back the raw data, now generate the core schedule data
	        // and save the data for later reference
	        console.log(data);

	        this.data = data;
	        observer.next(data);
          observer.complete();
	      });
    });
	}

}
