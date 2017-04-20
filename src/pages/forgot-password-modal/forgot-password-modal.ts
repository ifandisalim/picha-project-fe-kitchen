import { AccountManager } from './../../providers/account-manager';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

/*
	Generated class for the ForgotPasswordModal page.

	See http://ionicframework.com/docs/v2/components/#navigation for more info on
	Ionic pages and navigation.
*/
@Component({
	selector: 'page-forgot-password-modal',
	templateUrl: 'forgot-password-modal.html'
})
export class ForgotPasswordModalPage {

	retrievedUserId: string = null;
	enteredUserName: string = null;
	enteredPassword: string = null;
	userNotFound: boolean = false;

	constructor(public navCtrl: NavController,
		private navParams: NavParams,
		private accountMngr: AccountManager,
		private alertCtrl: AlertController,
		private viewCtrl: ViewController,
		private toastCtrl: ToastController) { }


	/**
	 * Page Methods
	 */

	retrieveUserId() {
		let userNamelowercase = this.enteredUserName.toLocaleLowerCase();
		this.accountMngr.retrieveUserIdByUserName(userNamelowercase)
			.subscribe(res => {
				this.retrievedUserId = res.user_id;
			},
			err => {

				if(err._body.type === "error"){
					this.toastCtrl.create({
						message: 'No internet connection / Server error',
						duration: 2500,
						position: 'bottom'
					}).present();

					return;
				}

				let errorBody = JSON.parse(err._body);
				if (errorBody.error.daoErrMessage === "No username found") {
					this.userNotFound = true;
					return;
				}

				let alert = this.alertCtrl.create({
					title: 'Failed Getting User ID',
					subTitle: 'Please contact developer',
					message: JSON.stringify(err._body),
					buttons: ['OK']
				});

				alert.present();

			});
	}


	closeModal(success = false) {
		this.viewCtrl.dismiss({ success });
	}



	submitResetPasswordForm(form) {
		let { password } = form.value;

		this.accountMngr.resetPassword(this.retrievedUserId, password)
			.subscribe(res => {
				let alert = this.alertCtrl.create({
					title: 'Successfully reset password.',
					message: 'Please login with new password',
					buttons: [{
						text: 'OK',
						handler: () => {
							this.closeModal(true);
						}
					}]
				});
				alert.present();
			}, err => {
				if(err._body.type === "error"){
					this.toastCtrl.create({
						message: 'No internet connection / Server error',
						duration: 2500,
						position: 'bottom'
					}).present();

					return;
				}
				
				let alert = this.alertCtrl.create({
					title: 'Failed Resetting Password',
					subTitle: 'Please contact developer',
					message: JSON.stringify(err._body),
					buttons: ['OK']
				});
				alert.present();
			});
	}




}
