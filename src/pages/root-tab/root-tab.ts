import { NgRedux } from '@angular-redux/store';
import IAppState from '../../states/IAppState';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewOrdersPage } from '../new-orders/new-orders';
import { OrdersPage } from '../orders/orders'
import { HistoryPage } from '../history/history'
import { SettingsPage } from '../settings/settings'

/*
  Generated class for the RootTab tabs.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Component({
  selector: 'page-root-tab',
  templateUrl: 'root-tab.html'
})
export class RootTabPage {

  newOrdersPage: any = NewOrdersPage;
  ordersPage: any = OrdersPage;
  historyPage: any = HistoryPage;
  settingsPage: any = SettingsPage;
  newOrdersCount: number = 0;
  showTab: boolean = null;

  constructor(public navCtrl: NavController,
  private ngRedux:NgRedux<IAppState>) {
    this.ngRedux.select(state => state.orderDetails)
      .subscribe(newOrderDetails => {
        this.newOrdersCount = newOrderDetails.newOrdersCount;
      });

  }

}