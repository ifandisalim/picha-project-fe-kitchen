import { ToastController, Toast } from 'ionic-angular';
import { AccountManager } from './account-manager';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgRedux } from '@angular-redux/store';
import IAppState from '../states/IAppState';
import moment from 'moment';


/*
  Generated class for the Utilities provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utilities {



  constructor(private http: Http, 
  private ngRedux: NgRedux<IAppState>,
  private accountMngr: AccountManager,
  private toastCtrl: ToastController) {
    
  }

  /**
   * Utility methods
   */


    arrayConsists(arr: Array<any>, item:any){
        if(arr.indexOf(item) === -1)
            return false;

        return true;
    }

    getCurrentDateTime(){
        let currentDateTime = moment();
        return currentDateTime.format('YYYY-MM-DD HH:mm');
    }

    formatISOtoDateTime(date: string){
        // Subtract 8 hours because ionic adds 8 hours due to malaysia time 
        return moment(date).subtract(8, 'hour').format('YYYY-MM-DD HH:mm');
    }


    getDateFromDateTime(date: string){
        return moment(date).format('D MMM YYYY');
    }

    getTimeFromDateTime(date: string){
        // Subtract 8 hours because ionic adds 8 hours due to malaysia time 
        return moment(date).format('h:mm A');
    }



    createToast(toastMessage: string): Toast{
        return this.toastCtrl.create({
            message: toastMessage,
            duration: 2000,
            position: 'bottom'
        });
    }

}
