import { FeedbackSingleComponent } from './../components/feedback-single/feedback-single';
import { OrderByPipe } from './../pipes/order-by-pipe';
import { ModalOrderDetailPage } from './../pages/modal-order-detail/modal-order-detail';
import { OrderDetailPage } from './../pages/order-detail/order-detail';
import { ListItemComponent } from './../components/list-item/list-item';
import { HistoryPage } from './../pages/history/history';
import { OrdersPage } from './../pages/orders/orders';
import { SettingsPage } from './../pages/settings/settings';
import { RootTabPage } from './../pages/root-tab/root-tab';
import { Utilities } from './../providers/utilities';



import { NewOrdersPage } from './../pages/new-orders/new-orders';
import { LoginPage } from './../pages/login/login';
import { ForgotPasswordModalPage } from './../pages/forgot-password-modal/forgot-password-modal';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IonicStorageModule } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';



import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import IAppState from './../states/IAppState';
import allReducers from './../states/reducers';
import { INITIAL_STATE } from './../states/store';

import { AccountManager } from './../providers/account-manager';
import { OrderManager } from './../providers/order-manager';
import { KitchenManager } from './../providers/kitchen-manager';


const cloudSettings = {
    'core':{
        'app_id': 'ce454bea'
    },
    'push':{
        'sender_id': '1039388299',
        'pluginConfig': {
            'ios':{
                'badge': true,
                'sound': true
            },
            'android':{
                'badge': true,
                'sound': true,
                'iconColor': '#515350'
            }
        }
    }
};




@NgModule({
  declarations: [
    MyApp,
    ForgotPasswordModalPage,
    LoginPage,
    NewOrdersPage,
    RootTabPage,
    SettingsPage,
    OrdersPage,
    HistoryPage,
    ForgotPasswordModalPage,
    OrderDetailPage,
    ListItemComponent,
    ModalOrderDetailPage,
    OrderByPipe,
    FeedbackSingleComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        scrollAssist: false,
        autoFocusAssist: false
    }),
    NgReduxModule,
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ForgotPasswordModalPage,
    LoginPage,
    NewOrdersPage,
    RootTabPage,
    SettingsPage,
    OrdersPage,
    HistoryPage,
    ForgotPasswordModalPage,
    OrderDetailPage,
    ModalOrderDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    KitchenManager,
    OrderManager,
    AccountManager,
    Keyboard,
    Utilities
  ]
})
export class AppModule {

  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(allReducers, INITIAL_STATE, []);
  }

}
