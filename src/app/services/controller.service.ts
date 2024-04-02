import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  loader: any;

  readyPage = new BehaviorSubject(null);

  constructor(
    public storage: Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) { }

  async initFunc(){
    await this.platform.ready();
    await this.createStorage();
  }

  setReadyPage(){
    this.readyPage.next(true);
  }

  async showLoader() {
      this.loader = await this.loadingCtrl.create({
      spinner: 'circles',
    });

    this.loader.present();
  }

  hideLoader(){
    this.loader.dismiss();
    this.loader = null;
  }

  async setStorage($key: string, $data: string){
    return await this.storage.set($key, $data);
  }

  async getStorage($key: string){
    return await this.storage.get($key);
  }

  async removeStorage($key: string){
    return await this.storage.remove($key);
  }

  async createStorage(){
    return await this.storage.create();
  }
}


