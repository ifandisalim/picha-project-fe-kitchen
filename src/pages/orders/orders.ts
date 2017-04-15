import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import actionConst from '../../states/actionsConst';
import { AccountManager } from './../../providers/account-manager';
import { Utilities } from './../../providers/utilities';
import { OrderManager } from './../../providers/order-manager';
import { OrderDetailPage } from './../order-detail/order-detail';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Orders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})

export class OrdersPage {


  hasOrders: boolean = true;
  remainingOrders = null;
  remainingOrderCount: number = 0;


  constructor(private navCtrl: NavController, 
  private navParams: NavParams,
  private orderMngr: OrderManager,
  private utilities: Utilities,
  private accountManager: AccountManager,
  private ngRedux: NgRedux<IAppState>) {}


  /**
   * Component Callbacks
   */
   ionViewWillEnter(){
     this.orderMngr.getRemainingOrders(this.accountManager.kitchenId, 0)
      .subscribe(res => {

        let formattedOrderHistory = res.order_history.map(order => {
            order.due_date =  this.utilities.getDateFromDateTime(order.due_datetime);
            order.due_time = this.utilities.getTimeFromDateTime(order.due_datetime);

            return order;
        });

        this.ngRedux.dispatch({
          type: actionConst.RETRIEVED_REMAINING_ORDERS,
          payload: {
            remainingOrders: formattedOrderHistory
          }
        });

        this.ngRedux.select(state => state.orderDetails)
          .subscribe(orderDetails => {
            this.remainingOrders = orderDetails.remainingOrders
          });
        
        this.remainingOrderCount =  this.remainingOrders.length;

      }, err => {
        let failedToast = this.utilities.createToast('Failed getting remaining orders. Check internet connection');
        failedToast.present();
      });

   }




  /**
   * Component Methods
   */
  viewOrder(data){
    this.navCtrl.push(OrderDetailPage, {orderId: data.orderId});
  }


}
