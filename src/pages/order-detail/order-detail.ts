import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import actionsConst from '../../states/actionsConst';
import { Utilities } from './../../providers/utilities';
import { OrderManager } from './../../providers/order-manager';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert, AlertInputOptions} from 'ionic-angular';

/*
  Generated class for the OrderDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html'
})
export class OrderDetailPage {

  orderId: number = null;
  orderDetail = null;
  changeStatusAlert: Alert = null;
  orderStatuses: string[] = ['IN PROGRESS', 'COMPLETED', 'PICKED UP'];
  statusInputs: AlertInputOptions[] = null;


  constructor(private navCtrl: NavController, 
  private navParams: NavParams, 
  private alertCtrl: AlertController,
  private orderMngr: OrderManager,
  private utilities: Utilities,
  private ngRedux: NgRedux<IAppState>) {}

  /***
   * Component Callbacks
   */
  ionViewWillLoad(){

    this.orderId = this.navParams.get('orderId');

    this.orderMngr.getOrderDetail(this.orderId)
      .subscribe(res => {

        this.orderDetail = res.order;
        this.orderDetail.due_datetime =  this.utilities.formatISOtoDateTime(this.orderDetail.due_datetime);
      }, err => {
        let failedToast = this.utilities.createToast('Failed getting order detail. Check internet connection');
        failedToast.present();
      });

    this.statusInputs = this.orderStatuses.map(status => {
        return{
          type: 'radio',
          name: 'orderStatus',
          label: status,
          value: status
        }
    });

  }

  /***
   * Component methods
   */
   changeOrderStatus(){

      let changeStatusAlert = this.alertCtrl.create({
        title: 'Order Status',
        inputs: this.statusInputs,
        buttons: [
          {
            text: 'OK',
            handler: (status) => {

              if(!status){
                return false;
              }

              this.orderMngr.updateOrderStatus(this.orderId, status, null)
                .subscribe(res => {
                  this.ngRedux.dispatch({
                    type: actionsConst.UPDATE_REMAINING_ORDERS_STATUS,
                    payload: {
                      newOrderStatus: status,
                      orderId: this.orderId
                    }
                  });

                  this.navCtrl.pop();

                }, err => {
                  let failedToast = this.utilities.createToast('Failed getting remaining orders. Check internet connection');
                  failedToast.present();
                });




            }
          }
        ]
    });

    changeStatusAlert.present();

   }

}
