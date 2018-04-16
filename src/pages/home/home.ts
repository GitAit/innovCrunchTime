import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, ItemSliding } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ExpertServiceProvider } from '../../providers/expert-service/expert-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	loading: Loading;
	isLoggedIn: boolean = false;
	profile: any;
	pageTitle: any = "Home";
	public skills: any;
	public experts: any;
	public notifications: any;

  constructor(public navCtrl: NavController, public expertServiceProvider: ExpertServiceProvider, private auth: AuthServiceProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.profile = localStorage.getItem("profile");

    if (this.profile=="group") { 
    	this.loadExperts();
    	this.pageTitle = "Experts";
    } else {
    	this.loadNotifications();
    	this.pageTitle = "Notifications";
    }
  }

  loadExperts(){
    this.showLoading()
    this.expertServiceProvider.load().subscribe(data => {

			this.skills = Object.keys(data);

			this.experts = [];

			for (let skill of this.skills) { 
			    this.experts.push(data[skill]);
			}

      this.loading.dismiss();
    },
      error => {
        // this.showError(error);
        console.log(error);
      });
  }

  loadNotifications(){
    this.showLoading()
    this.auth.loadNotifications().subscribe(data => {
      this.notifications = data;
      this.loading.dismiss();
    },
      error => {
        // this.showError(error);
        console.log(error);
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

  expertSelected(slidingItem: ItemSliding, item) {
  	console.log('Selected : ', item.id);
  	slidingItem.close();

  	var token = localStorage.getItem("authToken");

    this.auth.sendNotification(token, item.id).subscribe(data => {
      console.log("Sent Notification : "+data);
    },
      error => {
        // this.showError(error);
        console.log(error);
      });

    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }

  changeDateFormat(dateString) {
    let dateArr = dateString.split(" ", 2);
    dateArr.splice(0, 1);
    return dateArr.join("");
  }

  objectKeys(obj) {
	    return Object.keys(obj);
	}

  deleteNotif(item, index) {
  	console.log('Notif Selected : ', item.id);

  	this.notifications.splice(index, 1);

  	var token = localStorage.getItem("authToken");

    this.auth.deleteNotification(token, item.id).subscribe(data => {
      console.log("Deleted Notification : "+data);
    },
      error => {
        // this.showError(error);
        console.log(error);
      });

    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }

}
