import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { WeatherRootClass } from '../models/weather';
import { ControllerService } from '../services/controller.service';
import { NativeService } from '../services/native.service';
import { Position } from '@capacitor/geolocation';
import { GmapsService } from '../services/gmaps.service';

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
  locationName: String = '';

  data: WeatherRootClass;

  constructor(
    private weather: WeatherService,
    private controller: ControllerService,
    private native: NativeService,
    private maps: GmapsService
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

      let locationName = await this.maps.getLocationCity(position_response.coords.latitude, position_response.coords.longitude).catch((err) => {
        console.log(err);
        return undefined;
      });

      if(locationName != undefined){
        this.locationName = locationName;
      }else{
        let lat = Math.round(position_response.coords.latitude * 1000 ) / 1000;
        let lng = Math.round(position_response.coords.longitude * 1000 ) / 1000;
        this.locationName = `Lokacija: ${lat}, ${lng}`;
      }

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
