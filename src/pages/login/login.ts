import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
	authCredentials = { identifier: '', password: '' };
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

  public login() {
    this.showLoading()
    this.auth.login(this.authCredentials).subscribe(data => {
      if (data.identifier && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('identifier', data.identifier);
        localStorage.setItem('name', data.name);
        localStorage.setItem('profile', data.profile);

        this.navCtrl.setRoot(HomePage);
        
      } else if (!data.identifier) { 
        this.showError("Identifiant incorrect!!");
      } else if (!data.token) { 
        this.showError("Mot de passe incorrect!!");
      } else {
        this.showError("Accès Refusé");
      }
    },
      error => {
        this.showError(error);
      });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Merci de Patienter...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
