import { HttpClient } from '@angular/common/http';
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

  public login(credentials) {
    return new Promise((resolve, reject) => {
        var creds = "cne=" + credentials.cne + "&apogee=" + credentials.apogee+"&dateNaissance=" + credentials.dateNaissance + "&token=" + credentials.token;
        // debugger;
        let headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');


        this.http.post(apiUrl+'Login.php', creds, {headers: headers})
          .subscribe(data => {
            resolve(data.json());
          }, (err) => {
            reject(err);
          });
    });

    if (credentials.identifier === null || credentials.password === null) {
      return Observable.throw("Merci de remplir votre Identifiant et votre mot de passe");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend!

        var body = JSON.stringify({
		        identifier: credentials.identifier,
		        password: credentials.password
		    });

		    var headers = new Headers();
		    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		    this.http
		        .post(this.loginUrl, body, { headers: headers })
		        .subscribe(data => {
		                    console.log('login API success');
		                    console.log(data);
		                    observer.next(true);
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

  // constructor(public http: HttpClient) {
  //   console.log('Hello AuthServiceProvider Provider');
  // }

}
