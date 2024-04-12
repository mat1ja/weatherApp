import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WeatherRoot, WeatherRootClass } from '../models/weather';
import { LastDownloadWeather } from '../models/otherModels';
import { ControllerService } from './controller.service';

const storage_key = "last_weather_data";
const storage_data_key = "weather_data";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  lastDownload: LastDownloadWeather;
  weatherData: WeatherRootClass;

  constructor(
    private controller: ControllerService
  ) {
    this.lastDownload = new LastDownloadWeather();
    this.getLastDownload();
  }

  /**
   * function gets last download data from storage and sets it in object
   */
  async getLastDownload(): Promise<void>{
    let data = await this.controller.getStorage(storage_key);

    if(data != null){
      this.lastDownload.restoreData(data);
    }
  }

  getLastTimeDownload(): String{
    return this.lastDownload.getTimeString();
  }

  /**
   * 
   * @param lat current location
   * @param lng current location
   * @returns function returns  data about weather depending of current location
   */
  getWeatherFromAPI(lat: number, lng:number): Promise<WeatherRootClass>{
      let promise = new Promise<WeatherRootClass>((res, rej) => {
        const timeNow = Math.floor(Date.now() / 1000); // time in seconds
        const apiKey = environment.weather_api_key;
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=hourly,daily&lang=hr&units=metric&appid=${apiKey}`;

        // prevent reload weather data if location diff is under 500m and
        // time diff is under 15min
        if(this.lastDownload.locationDiff(lat, lng) || this.lastDownload.timeDiff()){ 
          fetch(url)
            .then((response) => {
              if(!response.ok){
                throw Error(response.statusText);
              }
              return response.json();
            })
            .then((data: WeatherRoot) => {
              this.lastDownload.setDownload(lat,lng);
              this.controller.setStorage(storage_key, this.lastDownload.getStringifyData());
              this.controller.setStorage(storage_data_key, JSON.stringify(data));
              let weather_object = new WeatherRootClass(data);
              this.weatherData = weather_object;
              res(weather_object);
            })
            .catch((err) => {
              console.log(err);
              rej(err);
            })
        }else{
          if(this.weatherData == undefined){
            this.controller.getStorage(storage_data_key).then(data_stor => {
              if(data_stor == null){
                throw Error("No data in storage");
              }else{
                let data = JSON.parse(data_stor);
                let weather_object = new WeatherRootClass(data);
                this.weatherData = weather_object;
                res(weather_object);
              }
            })
          }else{
            res(this.weatherData);
          }
        }
      });
      return promise;
  }

}
