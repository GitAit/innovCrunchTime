import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, ItemSliding, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ExpertServiceProvider } from '../../providers/expert-service/expert-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ExpertHomePage } from '../expert-home/expert-home';

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

    showRadio() {
      let alert = this.alertCtrl.create();
      alert.setTitle('Web');

      alert.addInput({
        type: 'radio',
        label: 'Hassan (Zone: A)',
        value: 'blue',
        checked: false
      });

      alert.addInput({
        type: 'radio',
        label: 'Zouhair (Zone: B)',
        value: 'blue',
        checked: false
      });

      alert.addButton('Annuler');
      alert.addButton({
        text: 'OK',
        handler: data => {
          // this.testRadioOpen = false;
          // this.testRadioResult = data;
        }
      });
      alert.present();

      // this.navCtrl.setRoot(ExpertHomePage);
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
