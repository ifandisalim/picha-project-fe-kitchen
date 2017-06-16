import {Component, OnInit} from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import {Feedback} from "../../beans/Feedback";
import {OrderManager} from "../../providers/order-manager";
import {Utilities} from "../../providers/utilities";
import {ModalOrderDetailPage} from "../modal-order-detail/modal-order-detail";



/*
 Generated class for the FeedbackReport page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-feedback-report',
    templateUrl: 'feedback-report.html'
})
export class FeedbackReportPage implements OnInit{

    positiveFeedbacks: Feedback[];
    negativeFeedbacks: Feedback[];
    feedbacks: Feedback[];
    month: string;
    monthlyPositivePercent: number;
    isLoading: boolean = true;


    constructor(public navCtrl: NavController, public navParams: NavParams,
                public orderMngr: OrderManager,
                public utilities: Utilities,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController) {

    }


    ngOnInit() {
    }

    ionViewWillEnter(){
        this.orderMngr.getMonthlyOrderFeedback(0)
            .subscribe(res => {
                this.isLoading = false;
                let feedbackRes = res.feedback_details;

                this.month = feedbackRes.month;
                this.monthlyPositivePercent  = feedbackRes.monthly_positive_percentage;

                this.positiveFeedbacks = feedbackRes.positive_comments.map((feedback) => {
                    return this.mapFeedbackResToFeedback(feedback);
                });

                this.negativeFeedbacks = feedbackRes.negative_comments.map((feedback) => {
                    return this.mapFeedbackResToFeedback(feedback);
                });

                this.feedbacks = this.negativeFeedbacks.concat(this.positiveFeedbacks);

            }, err => {
                this.isLoading = false;
                if(err._body.type === "error"){
                    this.toastCtrl.create({
                    message: 'No internet connection / Server error',
                    duration: 2500,
                    position: 'bottom'
                    }).present();

                    return;
                }
            });
    }


    mapFeedbackResToFeedback(feedbackRes){
        let feedback:Feedback;
        return {
            orderDate: this.utilities.getDateFromDateTime(feedbackRes.due_datetime),
            orderId: feedbackRes.order_id,
            comments: feedbackRes.comments,
            inputByFirstName: feedbackRes.input_by_firstname,
            isPositive: feedbackRes.is_positive,
            kitchenName: feedbackRes.kitchen_name
        }
    };

  viewOrderDetail(componentData) {
    let orderId = componentData.orderId;
    this.orderMngr.getOrderDetail(orderId)
      .subscribe(res => {
        const orderDetailModal = this.modalCtrl.create(ModalOrderDetailPage, { orderId, res });
        orderDetailModal.present();
      }, err => {
        if(err._body.type === "error"){
            this.toastCtrl.create({
              message: 'No internet connection / server error',
              duration: 2500,
              position: 'bottom'
            }).present();

            return;
          }
      });
  }



}
