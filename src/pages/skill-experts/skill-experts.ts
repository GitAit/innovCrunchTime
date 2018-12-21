import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SharedServiceProvider } from '../../providers/shared-service/shared-service';

/**
 * Generated class for the SkillExpertsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-skill-experts',
  templateUrl: 'skill-experts.html',
})
export class SkillExpertsPage {

	skill;
	experts;

  constructor(public navParams: NavParams, private auth: AuthServiceProvider, private shared: SharedServiceProvider) {
  	this.skill = navParams.data.skill;
  	this.experts = navParams.data.experts;
  }

  expertSelected(slidingItem: ItemSliding, item) {
  	this.shared.sendNotifEnabled = false;

  	console.log('Selected : ', item.id);
  	slidingItem.close();

  	var token = localStorage.getItem("authToken");

    this.auth.sendNotification(token, item.id).subscribe(data => {
      console.log("Sent Notification : "+data);

      setTimeout(() => {
	        this.shared.sendNotifEnabled = true;
	    }, 10000);
    },
      error => {
        // this.showError(error);
        console.log(error);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkillExpertsPage');
  }

}
