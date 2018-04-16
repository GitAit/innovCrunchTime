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
  public data: any;

  // apiUrl="http://uca-notes.uca.local/uca_notes/innovCrunchTime/";
  apiUrl="https://tough-vampirebat-53.localtunnel.me/uca_notes/innovCrunchTime/";

  loginUrl=this.apiUrl+"Login.php";
  updateTokenUrl=this.apiUrl+"updateToken.php";
  sendNotifUrl=this.apiUrl+"SendNotification.php";
  deleteNotifUrl=this.apiUrl+"DeleteNotification.php";
  notifsUrl=this.apiUrl+"ReceivedNotifications.php";

  public login(credentials) {

    if (credentials.identifier === null || credentials.password === null) {
      return Observable.throw("Merci de remplir votre Identifiant et votre mot de passe");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend!

        var deviceToken = localStorage.getItem("deviceToken");

        var creds = "identifier=" + credentials.identifier + "&password=" + credentials.password+"&deviceToken=" + deviceToken;

		    var headers = new Headers();
		    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

		    this.http
		        .post(this.loginUrl, creds, { headers: headers })
		        .subscribe(data => {
		                    console.log('login API success');
		                    console.log(data.json());
		                    observer.next(data.json());
		                    observer.complete();
		                }, error => {
		                    console.log(JSON.stringify(error.json()));
		                    observer.next(false);
		                    observer.complete();
		        });
      });
    }
  }

  updateToken(token, deviceToken) {
    return Observable.create(observer => {
      // At this point make a request to your backend!

      var creds = "token=" + token + "&deviceToken=" + deviceToken;

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      this.http
          .post(this.updateTokenUrl, creds, { headers: headers })
          .subscribe(data => {
                      console.log('updateToken API success');
                      console.log(data.json());
                      observer.next(true);
                      observer.complete();
                  }, error => {
                      console.log(JSON.stringify(error.json()));
                      observer.next(false);
                      observer.complete();
          });
    });
  }

  sendNotification(token, receiver_id) {
    return Observable.create(observer => {
      // At this point make a request to your backend!

      var creds = "authToken=" + token + "&receiver_id=" + receiver_id;

      console.log('Notif Params : '+creds);

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      this.http 
          .post(this.sendNotifUrl, creds, { headers: headers })
          .subscribe(data => {
                      console.log('Sent Notif API success');
                      console.log(data.json());
                      observer.next(true);
                      observer.complete();
                  }, error => {
                      console.log("Error : "+error);
                      observer.next(false);
                      observer.complete();
          });
    });
  }

  deleteNotification(token, notif_id) {
    return Observable.create(observer => {
      // At this point make a request to your backend!

      var creds = "authToken=" + token + "&notif_id=" + notif_id;

      console.log('Delete Notif Params : '+creds);

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      this.http 
          .post(this.deleteNotifUrl, creds, { headers: headers })
          .subscribe(data => {
                      console.log('Delete Notif API success');
                      console.log(data.json());
                      observer.next(true);
                      observer.complete();
                  }, error => {
                      console.log("Error : "+error);
                      observer.next(false);
                      observer.complete();
          });
    });
  }

  loadNotifications() {

    var notifsUrlParams = "?authToken="+localStorage.getItem("authToken");

    console.log("Notifs URL Params : "+notifsUrlParams);

    return Observable.create(observer => {
      this.http.get(this.notifsUrl+notifsUrlParams)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // console.log("Notifs : "+data);
          this.data = data;
          observer.next(data);
          observer.complete();
        });
    });
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
