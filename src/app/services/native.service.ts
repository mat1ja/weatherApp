import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class NativeService {

  constructor() { }

  async getMyLocation(){

    try{
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
    }
    catch{
      return null;
    }
  }
}
