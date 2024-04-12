import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { WeatherRootClass } from '../models/weather';
import { ControllerService } from '../services/controller.service';
import { NativeService } from '../services/native.service';
import { Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loadData: boolean = false;
  dataValid: boolean = true;
  positionError: boolean = false;

  lastDownloadTime: String = '';

  data: WeatherRootClass;

  constructor(
    private weather: WeatherService,
    private controller: ControllerService,
    private native: NativeService
  ) {}

  ionViewWillEnter(){
    this.getWeatherData();
  }

  loadDataTest(){
    this.getWeatherData();
  }

  async getWeatherData(){
    await this.controller.showLoader();
    let position_response: Position = await this.native.getMyLocation().catch((err) => {
      this.positionError = true;
      return undefined;
    });

    if(position_response !== undefined){
      this.positionError = false;

      let response: WeatherRootClass = await this.weather.getWeatherFromAPI(position_response.coords.latitude, position_response.coords.longitude).catch((err) => {
        this.dataValid = false;
        this.loadData = true;
        return undefined;
      });

      if(response !== undefined){
        this.lastDownloadTime = this.weather.getLastTimeDownload();
        this.loadData = true;
        this.dataValid = true;
        this.data = response;
      }
    }

    await this.controller.hideLoader();
  }
}
