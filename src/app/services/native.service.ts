import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class NativeService {

  constructor() { }

  /**
   * 
   * @returns return device native location
   */
  async getMyLocation(): Promise<Position>{
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }
}
