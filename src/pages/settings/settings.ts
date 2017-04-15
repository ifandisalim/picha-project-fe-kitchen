import { Push } from '@ionic/cloud-angular';
import { AccountManager } from './../../providers/account-manager';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import actionConst from '../../states/actionsConst';
import { Component } from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(private navCtrl: NavController, 
  private navParams: NavParams,
  private ngRedux: NgRedux<IAppState>,
  private storage: Storage,
  private app: App,
  private accountMngr: AccountManager,
  private push: Push,
  private toastCtrl: ToastController) { }

  /**
   * Component Methods
   */

  
    logOut(){
        this.push.unregister().then(() => {
            this.ngRedux.dispatch({
                type: actionConst.LOGOUT
            });

            this.storage.clear()
                .then(() => {
                  this.app.getRootNav().setRoot(LoginPage);
                });
        })
        .catch(err => {
            this.toastCtrl.create({
                message: 'Trouble logging out. Unable to unregister push notification',
                position: 'bottom',
                duration: 2500
            });
        })



    }



}
