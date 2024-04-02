import { DateService } from './date';
import { UnitConvertor } from './units';


let dateService = new DateService();
let convert = new UnitConvertor();

export interface WeatherRoot {
    lat: number
    lon: number
    timezone: string
    timezone_offset: number
    current: Current
    minutely: Minutely[]
    alerts?: Alert[]
}

interface Alert {
    sender_name: string
    event: string
    start: number
    end: number
    description: string
    tags: string[]
}
  
interface Current {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Weather[]
    rain?: Rain
}

interface Rain {
    "1h": number
  }
  
interface Weather {
    id: number
    main: string
    description: string
    icon: string
}
  
interface Minutely {
    dt: number
    precipitation: number
}

export class WeatherRootClass {
    lat: number
    lon: number
    timezone: string
    timezone_offset: number
    current: CurrentClass
    minutely: Minutely[]
    alerts?: AlertClass[]
    alerts_exist: boolean

    constructor(data: WeatherRoot){
        this.lat = data.lat;
        this.lon = data.lon;
        this.timezone = data.timezone;
        this.timezone_offset = data.timezone_offset;
        this.current = new CurrentClass(data.current);
        this.minutely = data.minutely;
        this.alerts = [];

        if(data?.alerts){
            data.alerts.map((data: Alert) => {
                let item = new AlertClass(data);
                this.alerts.push(item);
            });
            this.alerts_exist = true;
        }else{
            this.alerts_exist =false;
        }
    }
}

//https://openweathermap.org/api/one-call-3#list1

export class CurrentClass {
    dt: number
    sunrise: number
    sunset: number
    sunrise_display: string
    sunset_display: string
    temp: number
    temp_display: string
    feels_like: number
    pressure: number
    humidity: number
    pressure_display: string
    humidity_display: string
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: WeatherClass[]
    rain?: Rain

    constructor(data: Current){
        this.dt = data.dt;
        this.sunrise = data.sunrise;
        this.sunset = data.sunset;
        this.temp = data.temp;
        this.feels_like = data.feels_like;
        this.pressure = data.pressure;
        this.humidity = data.humidity;
        this.dew_point = data.dew_point;
        this.uvi = data.uvi;
        this.clouds = data.clouds;
        this.visibility = data.visibility;
        this.wind_speed = data.wind_speed;
        this.wind_deg = data.wind_deg;
        this.wind_gust = data.wind_gust;
        //this.weather = new WeatherClass(data.weather);
        this.rain = data.rain;

        this.sunrise_display = dateService.timestampToTime(this.sunrise);
        this.sunset_display = dateService.timestampToTime(this.sunset);

        this.temp_display = this.temp + ' °C';
        this.pressure_display = this.pressure + ' hPa';
        this.humidity_display =  this.humidity + ' %';

        if(data?.weather){
            this.weather = [];
            data.weather.map((item: Weather) => {
                this.weather.push(new WeatherClass(item));
            });
        }
    }
}

export class WeatherClass {
    id: number
    main: string
    description: string
    icon: string
    icon_url: string

    constructor(data: Weather){
        this.id = data.id;
        this.main = data.main;
        this.description = data.description;
        this.icon = data.icon;
        this.icon_url = `https://openweathermap.org/img/wn/${this.icon}@2x.png`;
    }
}

export class AlertClass {
    sender_name: string
    event: string
    start: number
    start_display: string;
    end: number
    end_display: string
    description: string
    tags: string[]

    constructor(data: Alert){
        this.sender_name = data.sender_name;
        this.event = data.event;
        this.start = data.start;
        this.end = data.end;
        this.description = data.description;
        this.tags = data.tags;
        this.start_display = dateService.timestampToDateTime(this.start);
        this.end_display = dateService.timestampToDateTime(this.end);
    }
}



