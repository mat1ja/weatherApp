import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export type GeoCodeData = GeoCodeRoot[]

export interface GeoCodeRoot {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code?: PlusCode
  types: string[]
}

export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface Geometry {
  bounds: Bounds
  location: Location
  location_type: string
  viewport: Viewport
}

export interface Bounds {
  south: number
  west: number
  north: number
  east: number
}

export interface Location {
  lat: number
  lng: number
}

export interface Viewport {
  south: number
  west: number
  north: number
  east: number
}

export interface PlusCode {
  compound_code: string
  global_code: string
}

@Injectable({
  providedIn: 'root'
})
export class GmapsService {

  googleMaps: any;
  geoCoder: any;
  objectIsCreate: boolean = false;

  constructor() {
    this.createObject();
   }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
     return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.google_map_api;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  async createObject(): Promise<void>{
    if(this.objectIsCreate == false){
      this.googleMaps = await this.loadGoogleMaps();
      this.geoCoder = new this.googleMaps.Geocoder();
      this.objectIsCreate = true;
    }
  }

  async getLocationCity(lat: number, lng: number): Promise<String>{
    await this.createObject();
    const location = new this.googleMaps.LatLng(lat, lng);

    let data_tmp: any = await this.geoCoder.geocode({location: location});
    let data: GeoCodeData = data_tmp['results'];
    let cityName = '';

    data[0].address_components.map(adr_comp => {
      if(adr_comp.types.includes('locality')){
        cityName = adr_comp.short_name;
      }
    });

    if(cityName != ''){
      return cityName;
    }else{
      throw "no location name";
    }
  }
}
