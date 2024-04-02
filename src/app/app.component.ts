import { Component } from '@angular/core';
import { ControllerService } from './services/controller.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public platform: Platform,
    private controller: ControllerService
  ) {
    this.initApp();
  }

  async initApp(){
    await this.controller.initFunc();
    this.setReadyPage();
  }

  async setReadyPage(){
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      // hide splash screen and show statusbar
      await SplashScreen.hide();
      await StatusBar.show();

      // set statusbar style
      await StatusBar.setStyle({ style: Style.Light });
    }

    // allow to run first page
    this.controller.setReadyPage();
  }
}
