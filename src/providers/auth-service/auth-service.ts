// import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User {
  identifier: string;
  name: string;
  profile: string;
 
  constructor(identifier: string, name: string, profile: string) {
    this.identifier = identifier;
    this.name = name;
    this.profile = profile;
  }
}


@Injectable()
export class AuthServiceProvider {
	currentUser: User;
  loginUrl="http://uca-notes.uca.local/uca_notes/innovCrunchTime/Login.php";

  public login(credentials) {

    if (credentials.identifier === null || credentials.password === null) {
      return Observable.throw("Merci de remplir votre Identifiant et votre mot de passe");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend!

        var deviceToken = "FAKE$76Adw8ccohB7RokPOHdy8.g2Q0gmfHonMfCO1K5fmmo.q.uuvBeZO";

        var creds = "identifier=" + credentials.identifier + "&password=" + credentials.password+"&deviceToken=" + deviceToken;

		    var headers = new Headers();
		    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		    this.http
		        .post(this.loginUrl, creds, { headers: headers })
		        .subscribe(data => {
		                    console.log('login API success');
		                    console.log(data.json());
		                    observer.next(false);
		                    observer.complete();
		                }, error => {
		                    console.log(JSON.stringify(error.json()));
		                    observer.next(false);
		                    observer.complete();
		        });
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

}
