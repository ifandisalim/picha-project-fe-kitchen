import { OrderManager } from './../../providers/order-manager';
import { Utilities } from './../../providers/utilities';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ModalOrderDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-order-detail',
  templateUrl: 'modal-order-detail.html'
})
export class ModalOrderDetailPage {
    orderDetail = null;
    feedback = null;
    orderId: number = null;
    ordersTotalPrice: number = null;
    kitchenName: string = null;
    dueDateTime: string = null;
    rejectedReason:string = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, public orderMrgr: OrderManager,
                public viewCtrl: ViewController,
                public utilities: Utilities) {

    }

    /**
     * Component callbacks
     * */
    ionViewWillLoad(){
        this.orderId = this.navParams.get('orderId');
        this.orderDetail = this.navParams.get('res').order;

        this.ordersTotalPrice = this.orderDetail.orders.reduce((currentSum, order) => {
            currentSum += parseInt(order.price);
            return currentSum;
        }, 0);

        this.kitchenName = this.orderDetail.kitchen_name;
        this.rejectedReason = this.orderDetail.rejected_reason;
        console.log(this.rejectedReason);
        this.dueDateTime = this.utilities.getDateFromDateTime(this.orderDetail.due_datetime);

        this.feedback = {
            comments: this.orderDetail.comments,
            inputByFirstName: this.orderDetail.input_by_firstname,
            isPositive: this.orderDetail.is_positive,
            orderDate: this.utilities.getDateFromDateTime(this.orderDetail.due_datetime),
            kitchenName: this.orderDetail.kitchen_name
        };

    }

    closeModal(){
        this.viewCtrl.dismiss();
    }


}
