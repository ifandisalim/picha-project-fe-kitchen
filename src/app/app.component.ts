import { RootTabPage } from './../pages/root-tab/root-tab';
import { AccountManager } from './../providers/account-manager';
import { NewOrdersPage } from './../pages/new-orders/new-orders';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard'; 
import { NgRedux } from '@angular-redux/store';
import { Storage } from '@ionic/storage';
import IAppState from '../states/IAppState';
import actionConst from '../states/actionsConst';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  loginPage: any = LoginPage;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public ngRedux: NgRedux<IAppState>,
    public accountMngr: AccountManager,
    public keyboard: Keyboard,
    public storage: Storage
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.keyboard.onKeyboardShow().subscribe( (data) => {
          this.ngRedux.dispatch({
              type: actionConst.KEYBOARD_SHOWN
          });
      });

      this.keyboard.onKeyboardHide().subscribe( data => {
          this.ngRedux.dispatch({
              type: actionConst.KEYBOARD_HIDDEN
          });
      });

      this.storage.ready()
          .then(() => {

              this.storage.get('currentKitchen')
                  .then((currentKitchen) => {
                      if(currentKitchen){
                          this.ngRedux.dispatch({
                              type: actionConst.LOGIN_SUCCESS,
                              payload:{
                                  accessToken: currentKitchen.accessToken,
                                  kitchenId: currentKitchen.kitchenId,
                                  userId: currentKitchen.userId,
                                  firstName: currentKitchen.firstName
                              }
                          });

                        this.ngRedux.dispatch({
                            type: actionConst.SHOW_TAB
                        });
                    
                        this.accountMngr.registerPushToken();
                        this.nav.setRoot(RootTabPage);
                          

                      }
                  });
          });
    });
  }
}
