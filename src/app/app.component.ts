import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { FCM } from '@ionic-native/fcm';

declare var FCMPlugin;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  homePage: HomePage;

  pages: Array<{title: string, component: any}>;

  isLoggedIn: boolean = false;

  homeTitle: any = "Accueil";

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private toastCtrl: ToastController, private auth: AuthServiceProvider, private fcm: FCM, public events: Events, private alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Accueil", component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      var that = this;

      if (typeof FCMPlugin != 'undefined') {
        FCMPlugin.getToken(
          (t) => {
            // this.loginData.token = t;
            // this.executeLogin();
            // this.showToast(t);
            localStorage.setItem('deviceToken', t);
          },
          (e) => {
            // this.showToast('error retrieving token: ' + e);
          }
        );

        //Note that this callback will be fired everytime a new token is generated, including the first time.
        FCMPlugin.onTokenRefresh(function(token){
            localStorage.setItem('deviceToken', token);

            if(localStorage.getItem("token")) {
              this.updateToken(localStorage.getItem("token"), token);
            }
        });

        FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
              //Notification was received on device tray and tapped by the user.

              if (localStorage.getItem("profile")=="expert") { 
                that.events.publish('notif:received', data.body);
              }
              
              // that.nav.setRoot(HomePage);

            }else{
              //Notification was received in foreground. Maybe the user needs to be notified.
              // alert( JSON.stringify(data) );
              // that.showToast(JSON.stringify(data));

              if (localStorage.getItem("profile")=="expert") { 
                that.events.publish('notif:received', data.body);
                // that.showNotification(data.body);
              }

            }
          },
          function(msg){ //success handler
              console.log('onNotification callback successfully registered: ' + msg);
          },
          function(err){ //error handler
              console.log('Error registering onNotification callback: ' + err);
          }
        );
      }

      if(!localStorage.getItem("authToken")) {
        this.nav.setRoot(LoginPage);
      } else {
        this.nav.setRoot(HomePage);
        this.isLoggedIn = true;
      }

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  showNotification(text) {
 
    let alert = this.alertCtrl.create({
      title: 'Notification',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);

    this.events.publish('notif:received', text);

    // this.homePage.loadNotifications();
  }

  updateToken(token, deviceToken) {
    this.auth.updateToken(token, deviceToken).subscribe(data => {
       console.log('Token updated');
    },
      error => {
        // this.showError(error);
        console.log('Error update token');
      });
  }

  logout() {

    this.auth.logout(localStorage.getItem("authToken")).subscribe(data => {
       console.log('Logged Out');
    },
      error => {
        // this.showError(error);
        console.log('Error logout');
      });
    
    localStorage.removeItem('authToken');

    this.nav.setRoot(LoginPage);

    // this.authServiceProvider.logout().then((result) => {
    //   this.loading.dismiss();
    //   let nav = this.app.getRootNav();
    //   nav.setRoot(LoginPage);
    // }, (err) => {
    //   this.loading.dismiss();
    //   this.presentToast(err);
    // });
  }
}
