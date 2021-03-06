import {NgRedux} from '@angular-redux/store';
import IAppState from '../states/IAppState';
import {EP_HOST} from './../constants/api';
import {AccountManager} from './account-manager';
import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';


/*
 Generated class for the OrderManager provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class OrderManager {

    newOrdersCount: number = null;
    kitchenId: number = null;
    requestHeader: RequestOptions = null;

    constructor(private http: Http,
                private accountMngr: AccountManager,
                private ngRedux: NgRedux<IAppState>) {

        this.ngRedux.select(state => state.orderDetails)
            .subscribe(orderDetails => {
                this.newOrdersCount = orderDetails.newOrdersCount;
            });

        this.ngRedux.select(state => state.currentKitchen)
            .subscribe(currentKitchen => {
                this.kitchenId = currentKitchen.kitchenId;
            });

        this.requestHeader = this.accountMngr.headerWithAccessToken;

    }


    /**
     * Provider Methods
     */
    getNewOrders(kitchenId: number) {
        return this.http.get(`${EP_HOST}/order/new/${kitchenId}`, this.requestHeader)
            .map(res => res.json());
    }

    updateOrderStatus(order, status: string, rejectedReason: string, kitchenId: number) {
        return this.http.post(`${EP_HOST}/order/update_status`, {
            order: order,
            kitchen_id: kitchenId,
            status,
            rejected_reason: rejectedReason
        }, this.requestHeader)
            .map(res => res.json());
    }

    getRemainingOrders(kitchenId: number, offset: number) {
        return this.http.get(`${EP_HOST}/order/history/incomplete/kt/${offset}/${kitchenId}`, this.requestHeader)
            .map(res => res.json());
    }

    getOrderDetail(orderId: number) {
        return this.http.get(`${EP_HOST}/order/${orderId}`, this.requestHeader)
            .map(res => res.json());
    }

    getCompletedOrderHistory(kitchenId: number, offset: number) {
        return this.http.get(`${EP_HOST}/order/history/completed/kt/${offset}/${kitchenId}`, this.requestHeader)
            .map(res => res.json());
    }


    getMonthlyOrderFeedback(offset: number) {
        return this.http.get(`${EP_HOST}/order/feedback/monthly/kt/${offset}/${this.kitchenId}`, this.requestHeader)
            .map(res => res.json());
    }

}
