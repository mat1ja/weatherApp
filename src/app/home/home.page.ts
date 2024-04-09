import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { WeatherRootClass } from '../models/weather';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loadData: boolean = false;
  data: WeatherRootClass;

  constructor(
    private weather: WeatherService
  ) {}

  ionViewWillEnter(){
    this.getWeatherData();
  }

  async getWeatherData(){
    let response = await this.weather.getWeather();

    if(response){
      this.loadData = true;
      this.data = response;
    }else{
      this.loadData = false;
    }
  }

}
