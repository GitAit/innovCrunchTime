import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController, ItemSliding, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ExpertServiceProvider } from '../../providers/expert-service/expert-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SkillExpertsPage } from '../skill-experts/skill-experts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	loading: Loading;
	isLoggedIn: boolean = false;
	profile: any;
	pageTitle: any = "Home";
  notifSwitch: any = "actives";
	notifsCount: any = 0;
	public skills: any;
	public experts: any;
	public notifications: any;
	public archivedNotifications: any;

  constructor(public navCtrl: NavController, public expertServiceProvider: ExpertServiceProvider, private auth: AuthServiceProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public events: Events) {
    this.profile = localStorage.getItem("profile");

    if(!localStorage.getItem("authToken")) {
      this.navCtrl.setRoot(LoginPage);
    }

    if (this.profile=="group") { 
    	this.loadExperts();
    	this.pageTitle = "Experts";
    } else {
    	this.loadNotifications();
    	this.loadArchivedNotifications();
    	this.pageTitle = "Notifications";
    	this.notifSwitch = "actives"; 
    }

    this.events.subscribe('notif:received', (text) => {
		  this.loadNotifications();
		});
  }

  loadExperts(){
    this.showLoading()
    this.expertServiceProvider.load().subscribe(data => {

			this.skills = Object.keys(data);

			this.experts = [];

			for (let skill of this.skills) { 
			    this.experts.push(data[skill]);
			}

      this.dismissLoading();
    },
      error => {
        // this.showError(error);
        console.log(error);
        this.dismissLoading();
      });
  }

  loadNotifications(){
  	this.showLoading();
    this.auth.loadNotifications().subscribe(data => {
      this.notifications = data;
      this.notifsCount = this.notifications.length;
      this.dismissLoading();
    },
      error => {
        // this.showError(error);
        console.log(error);
        this.dismissLoading();
      });
  }

  loadArchivedNotifications(){
  	this.showLoading();
    this.auth.loadArchivedNotifications().subscribe(data => {
      this.archivedNotifications = data;
      this.dismissLoading();
    },
      error => {
        // this.showError(error);
        console.log(error);
        this.dismissLoading();
      });
  }

  showLoading() {
    if(!this.loading){
	    this.loading = this.loadingCtrl.create({
	      content: 'Merci de Patienter...',
	      dismissOnPageChange: true
	    });
	    this.loading.present();
    }
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
	}

  showError(text) {
    this.dismissLoading();
 
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(alert);
  }

  openSkillExpertsPage(item, experts) {
    this.navCtrl.push(SkillExpertsPage, { skill: item, experts: experts });
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

      this.loadArchivedNotifications();
    },
      error => {
        // this.showError(error);
        console.log(error);
      });

    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }

  ionViewDidEnter() {
    // this.showError("Hello");
  }

}
