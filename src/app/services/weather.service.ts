import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WeatherRoot, WeatherRootClass } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  lastDownload: number = 0; //seconds
  weatherData: WeatherRootClass;

  constructor(
  ) { }


  async getWeather(): Promise<WeatherRootClass>{
    try{
      return await this.getWeatherFromAPI();
    }catch{
      return null;
    }
  }


  // save last download to memory
  // create weather object

  getWeatherFromAPI(): Promise<WeatherRootClass>{
      let promise = new Promise<WeatherRootClass>((res, rej) => {
        const timeNow = Math.floor(Date.now() / 1000); // time in seconds
        let timeDiff = timeNow - this.lastDownload;
        const lat = '46.39';
        const lng = '16.42';
        const apiKey = environment.weather_api_key;
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=hourly,daily&lang=hr&units=metric&appid=${apiKey}`;

        if(timeDiff > 1 * 60 * 5){ // 5min
          fetch(url)
            .then((response) => {
              if(!response.ok){
                throw Error(response.statusText);
              }
              this.lastDownload = Math.floor(Date.now() / 1000);
              return response.json();
            })
            .then((data: WeatherRoot) => {
              let weather_object = new WeatherRootClass(data);
              this.weatherData = weather_object;
              res(weather_object);
            })
            .catch((err) => {
              console.log(err);
              rej(false);
            })
        }else{
          res(this.weatherData);
        }
      });

      return promise;
  }


}
