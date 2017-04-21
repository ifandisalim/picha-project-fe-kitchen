import { ModalOrderDetailPage } from './../modal-order-detail/modal-order-detail';
import { Utilities } from './../../providers/utilities';
import { AccountManager } from './../../providers/account-manager';
import { OrderManager } from './../../providers/order-manager';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

    orderHistories;
    orderCounter: number;
    firstName: string;
    isLoading: boolean;
    hasInternet: boolean;
    hasOrders: boolean;



  constructor(private navCtrl: NavController, 
  private navParams: NavParams,
  private modalCtrl: ModalController,
  private toastCtrl: ToastController,
  private orderMngr: OrderManager,
  private accountMngr: AccountManager,
  private utilities: Utilities) {
    this.orderCounter = null;
    this.orderHistories = null;
  }

  /**
   * Component Callbacks
   */
  ionViewWillEnter(){

    // Initialize variables
    this.isLoading = true;
    this.hasInternet = true;
    this.hasOrders = true;

    this.orderMngr.getCompletedOrderHistory(this.accountMngr.kitchenId, 0)
    .subscribe(res => {
      this.isLoading = false;
      this.hasInternet = true;

      console.log(res);

        let formattedOrderHistory = res.order_history.map(order => {
            order.due_date =  this.utilities.getDateFromDateTime(order.due_datetime);
            order.due_time = this.utilities.getTimeFromDateTime(order.due_datetime);

            return order;
        });

        this.orderHistories = formattedOrderHistory;
        this.orderCounter = this.orderHistories.length;



    }, err => {
      this.isLoading = false;
      this.hasInternet = true;

        if(err._body){

          if(err._body.type === "error"){
            this.hasInternet = false;
            return;
          }

          let errBody = JSON.parse(err._body);
          if(errBody.error.daoErrMessage === 'No order found'){
            this.hasOrders = false;
            return;
          }

        }



        let failedToast = this.utilities.createToast('Failed getting remaining orders. Check internet connection');
        failedToast.present();
      
    });
    
  }


  /**
   * Component Methods
   */
    viewOrder(orderId){
      console.log(orderId)
        this.orderMngr.getOrderDetail(orderId)
            .subscribe(res => {
                const orderDetailModal = this.modalCtrl.create(ModalOrderDetailPage, {orderId, res});
                orderDetailModal.present();
            }, err => {
                if(err._body.type === "error"){
                        this.toastCtrl.create({
                        message: 'No internet connection / Server Error',
                        duration: 2500,
                        position: 'bottom'
                        }).present();

                        return;
                    }
            });
    }


    loadMoreOrder(infiniteScroll){

        this.orderMngr.getCompletedOrderHistory(this.accountMngr.kitchenId, this.orderCounter)
            .subscribe(res => {
                let formattedOrderHistory = res.order_history.map(order => {
                   order.due_date =  this.utilities.getDateFromDateTime(order.due_datetime);
                   order.due_time = this.utilities.getTimeFromDateTime(order.due_datetime);

                   return order;
                });

                this.orderHistories = this.orderHistories.concat(formattedOrderHistory);
                this.orderCounter = this.orderHistories.length;

                infiniteScroll.complete();
            }, err => {

                if(err._body.type === "error"){
                        this.toastCtrl.create({
                        message: 'No internet connection / Server error',
                        duration: 2500,
                        position: 'bottom'
                        }).present();

                        return;
                }

                let errBody = JSON.parse(err._body);


                infiniteScroll.enable(false);
            });

        
    }


}
