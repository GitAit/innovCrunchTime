import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpertHomePage } from './expert-home';

@NgModule({
  declarations: [
    ExpertHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ExpertHomePage),
  ],
})
export class ExpertHomePageModule {}
