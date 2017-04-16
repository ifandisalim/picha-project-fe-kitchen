import { RootTabPage } from './../root-tab/root-tab';

import { NewOrdersPage } from './../new-orders/new-orders';
import { ForgotPasswordModalPage } from './../forgot-password-modal/forgot-password-modal';
import { AccountManager } from './../../providers/account-manager';
import { Utilities } from './../../providers/utilities';
import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, ToastController, App } from 'ionic-angular';
import actionConst from '../../states/actionsConst';
import { CurrentKitchen } from '../../beans/CurrentKitchen';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  isSubmitError: boolean = false;
  submitErrorMsg: string = '';
  isLoggingIn: boolean = false;
  keyboardShown: boolean = null;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private ngRedux: NgRedux<IAppState>,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private utilities: Utilities,
    private accountMngr: AccountManager,
    private app: App) { }


  /**
   * Component Callbacks
   */
  ionViewWillLoad() {

    
   this.ngRedux.select(state => state.keyboardShown)
    .subscribe(keyboardShown => {
      this.keyboardShown = keyboardShown;
    });


    this.ngRedux.dispatch({
      type: actionConst.HIDE_TAB
    });

  }


  onLogIn(form) {
    this.isLoggingIn = true;
    this.submitErrorMsg = null;

    const { username, password } = form.value;
    form.reset();

    this.accountMngr.login(username, password)
      .subscribe(res => {
        this.isLoggingIn = false;

        let currentKitchen: CurrentKitchen = {
            accessToken: res.access_token,
            kitchenId: res.kitchen_id,
            userId: res.user_id,
            firstName: res.firstname
        }

        this.ngRedux.dispatch({
          type: actionConst.LOGIN_SUCCESS,
          payload:{
            accessToken : currentKitchen.accessToken,
            kitchenId: currentKitchen.kitchenId,
            userId: currentKitchen.userId,
            firstName: currentKitchen.firstName
          }
        });

        this.accountMngr.registerPushToken();

        this.accountMngr.setKitchenDataToLs(currentKitchen);
        this.app.getRootNav().setRoot(RootTabPage);

      }, err => {
        this.isLoggingIn = false;
        this.isSubmitError = true;



        if(err._body){

          if(err._body.type === "error"){
            this.toastCtrl.create({
              message: 'Login failed. No internet connection',
              duration: 2500,
              position: 'bottom'
            }).present();

            return;
          }

          let errBody = JSON.parse(err._body);

          if (errBody.errMessage.toLowerCase() === 'wrong password') {
            this.submitErrorMsg = 'Wrong password.';
            return;
          }


          if (errBody.error.daoErrMessage.toLowerCase() === 'no user found') {
            this.submitErrorMsg = 'No user with that username.';
            return;
          }


        }

      });
  }

  forgotPassword() {
    const forgotPassModal = this.modalCtrl.create(ForgotPasswordModalPage);
    forgotPassModal.present();

    forgotPassModal.onDidDismiss((data) => {
      let toastMessage = (data.success ? 'Succesfully reset password.' : 'Failed to reset password.');
      let toast = this.toastCtrl.create({
        message: toastMessage,
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
    });
  }


}
