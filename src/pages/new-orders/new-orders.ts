import { Push } from '@ionic/cloud-angular';
import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import { Utilities } from './../../providers/utilities';
import { OrderManager } from './../../providers/order-manager';
import { Component } from '@angular/core';
import { NavController, NavParams, Alert, AlertInputOptions, AlertController } from 'ionic-angular';
import actionConst from '../../states/actionsConst';



/*
  Generated class for the NewOrders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-orders',
  templateUrl: 'new-orders.html'
})
export class NewOrdersPage {



  hasOrders:boolean = true;
  newOrders = null;
  newOrdersCount: number = 0;
  isLoading: boolean = true;
  hasInternet: boolean = true;

  statusInputs: AlertInputOptions[] = null;
  changedStatus: string = null;

  rejectReasonAlert: Alert = null;
  rejectReasonInputs: AlertInputOptions[] = null;
  rejectReason: string = null;


  constructor(private navCtrl: NavController, 
  private navParams: NavParams, 
  private alertCtrl: AlertController,
  private orderMngr: OrderManager,
  private utilities: Utilities,
  private ngRedux: NgRedux<IAppState>,
  private push:Push) {}


  /**
   * Component Callbacks
   */

  ionViewWillEnter(){
    this.hasOrders = true;

  /**
   * If notification of new order comes, get new order again from BE
   */
		this.push.rx.notification()
			.subscribe((message) => {
        this.isLoading = true;
        this.hasInternet = true;

				if(message.title === 'New Order'){
          this.orderMngr.getNewOrders()
            .subscribe(res => {
              this.isLoading = false;
              this.hasInternet = true;


              let formattedOrderHistory = res.order_history.map(order => {
                  order.due_date =  this.utilities.getDateFromDateTime(order.due_datetime);
                  order.due_time = this.utilities.getTimeFromDateTime(order.due_datetime);

                  // this.isLoading = false;

                  return order;
              });

              this.newOrders = formattedOrderHistory;

              
              let updatedNewOrdersCount = this.newOrders.length;

              this.updateNewOrdersCount(updatedNewOrdersCount);

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

              let failedToast = this.utilities.createToast('Failed retrieving new orders details. Check internet connection.');
              failedToast.present();
            });
        }
			});

    /* End of notification */

    this.ngRedux.dispatch({
      type: actionConst.SHOW_TAB
    });

    this.orderMngr.getNewOrders()
      .subscribe(res => {

        this.isLoading = false;
        this.hasInternet = true;

        let formattedOrderHistory = res.order_history.map(order => {
            order.due_date =  this.utilities.getDateFromDateTime(order.due_datetime);
            order.due_time = this.utilities.getTimeFromDateTime(order.due_datetime);

            return order;
        });

        this.newOrders = formattedOrderHistory;

        
        let updatedNewOrdersCount = this.newOrders.length;

        this.updateNewOrdersCount(updatedNewOrdersCount);

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

        let failedToast = this.utilities.createToast('Failed retrieving new orders details. Check internet connection.');
        failedToast.present();
      });

      


    this.statusInputs = [
      {
        type: 'radio',
        label: 'Accept',
        value: 'TODO',
        name: 'orderStatus'
      },
      {
        type: 'radio',
        label: 'Reject',
        value: 'REJECTED',
        name: 'orderStatus'
      }
    ];



    this.rejectReasonInputs = [
      {
        type: 'text',
        name: 'rejectReason',
        placeholder: 'Reject Reason'
      }
    ];


    
  }


  /**
   * Component Methods
   */
  setNewOrderStatus(data){
    

    let selectedOrderId = data.orderId;

    let selectedOrder = this.newOrders.filter(order => {
      return order.order_id === selectedOrderId
    });
 
    let rejectReasonAlert = this.alertCtrl.create({
      title: 'Reject Reason',
      inputs: this.rejectReasonInputs,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {

            this.rejectReason = data.rejectReason;

              if(! this.rejectReason ||  this.rejectReason.trim() === ''){
                return false;
              }


            this.orderMngr.updateOrderStatus(selectedOrder[0], this.changedStatus, this.rejectReason)
              .subscribe(res => {
                
                this.newOrders = this.removeOrderFromArray(selectedOrderId, this.newOrders);
                let updatedNewOrdersCount = this.newOrders.length;
                this.updateNewOrdersCount(updatedNewOrdersCount);
              }, err => {
                 let failedToast = this.utilities.createToast('Failed updating order status. Check internet connection');
                 failedToast.present();
              });
          }
        }
      ]
    });


    let changeStatusAlert = this.alertCtrl.create({
      title: 'Accept / Reject order',
      inputs: this.statusInputs,
      buttons: [
        {
          text: 'OK',
          handler: (status) => {

            if(!status || status.trim() === ''){
              return false;
            }

            this.changedStatus = status;

            if(status === 'REJECTED'){
              rejectReasonAlert.present();
              return;
            }


            this.orderMngr.updateOrderStatus(selectedOrder[0], this.changedStatus, null)
              .subscribe(res => {
                this.newOrders = this.removeOrderFromArray(selectedOrderId, this.newOrders);
                let updatedNewOrdersCount = this.newOrders.length;
                this.updateNewOrdersCount(updatedNewOrdersCount);
              }, err => {
                 let failedToast = this.utilities.createToast('Failed updating order status. Check internet connection');
                 failedToast.present();
              });


          }
        }
      ]
    });

    changeStatusAlert.present();
  }


  removeOrderFromArray(orderId: number, orderArray){
    return orderArray.filter(order => order.order_id !== orderId);
  }

  updateNewOrdersCount(newOrdersCount: number){
        this.ngRedux.dispatch({
          type: actionConst.UPDATE_NEW_ORDER_COUNT,
          payload:{
            newOrdersCount
          }
        });

        this.newOrdersCount = this.orderMngr.newOrdersCount;
  }

}

