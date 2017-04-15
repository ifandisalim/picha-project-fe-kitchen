import { EP_HOST } from './../constants/api';
import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import IAppState from '../states/IAppState';
import actionConst from '../states/actionsConst';
import { Storage } from '@ionic/storage';
import { Push, PushToken } from '@ionic/cloud-angular';




/*
  Generated class for the AccountManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AccountManager {

	public accessToken: string = null;
	public kitchenId: number = null;
	public userId: number = null;
	public firstName: string = null;
	public headerWithAccessToken: RequestOptions = null;

	constructor(private http: Http,
		private ngRedux: NgRedux<IAppState>,
		private storage: Storage,
		private push: Push) {

		this.ngRedux.select(state => state.currentKitchen)
			.subscribe(currentKitchen => {
				this.accessToken = currentKitchen.accessToken;
				this.kitchenId = currentKitchen.kitchenId;
				this.userId = currentKitchen.userId;
				this.firstName = currentKitchen.firstName;

				let headers = new Headers({
					"access_token": this.accessToken
				});

				this.headerWithAccessToken = new RequestOptions({
					headers
				});

			});


	}



  /**
   * Provider Methods
   */


	login(username: string, password: string) {
		username = username.toLowerCase();

		return this.http.post(EP_HOST + `/user/login`, {
			username,
			password,
			user_type: 'kitchen_team'
		})
			.map(res => res.json());
	}

	setKitchenDataToLs(currentKitchen): void {
		this.storage.set('currentKitchen', currentKitchen);
	}




	retrieveUserIdByUserName(username: string) {
		return this.http.post(EP_HOST + '/user/retrieve_id', {
			username
		})
			.map(res => res.json());
	}


	resetPassword(user_id: string, new_password: string) {
		return this.http.post(EP_HOST + '/user/reset_password', {
			user_id,
			new_password
		})
			.map(res => res.json());
	}


	updatePushToken(push_token: string) {
		let headers = new Headers({
			"access_token": this.accessToken
		});

		let headerOptions = new RequestOptions({
			headers
		});

		console.log('Called update push token');

		return this.http.post(EP_HOST + '/user/update_push_token', {
			push_token
		}, headerOptions)
			.map(res => res.json());
	}


	registerPushToken() {

		this.push.register().then((token: PushToken) => {
			return this.push.saveToken(token);
		}).then((token: PushToken) => {

			this.updatePushToken(token.token)
				.subscribe(res => {

				}, err => {
					alert('error updating push token');
				});
		});

		this.push.rx.notification()
			.subscribe((message) => {
				alert(`${message.title}: ${message.text}`);
			});
	}






}
