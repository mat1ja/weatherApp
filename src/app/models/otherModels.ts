import { DateService } from './date';
let dateService = new DateService();

export class LastDownloadWeather {
    lat: number
    lon: number
    time: number

    constructor(){
        this.lat = 0;
        this.lon = 0;
        this.time = 0;
    }

    getTimeString(): string{
       return dateService.timestampToDateTime(this.time);
    }

    /**
     * 
     * @returns get data to save it in storage
     */
    getStringifyData(): string{
        let data = {lat: this.lat, lon: this.lon, time: this.time};
        return JSON.stringify(data);
    }

    /**
     * 
     * @param data_str restore data from storage
     */
    restoreData(data_str: string): void{
        try{
            let data = JSON.parse(data_str);
            this.lat = data.lat;
            this.lon = data.lon;
            this.time = data.time;
        }catch(err){
            console.error(err);
        }
    }

    /**
     * 
     * @param lat location at download time
     * @param lon location at download time
     *
     * function save location and time of current download
     */
    setDownload(lat: number, lon: number): void{
        this.lat = lat;
        this.lon = lon;
        this.time = Math.floor(Date.now() / 1000); // time in seconds
    }

    /**
     * 
     * @returns difference between curren and last download time
     */
    timeDiff(): Boolean{
        if(this.time == 0){
            return true;
        }else{
            const timeNow = Math.floor(Date.now() / 1000); // time in seconds
            let timeDiff = timeNow - this.time;
            if(timeDiff > 1 * 60 * 15){ // 15min
                return true;
            }else{
                return false;
            }
        }
    }

    /**
     * 
     * @param lat current location
     * @param lon current location
     * @returns difference between current location and location when last time was data donloaded 
     */
    locationDiff(lat: number, lon:number): Boolean{
        if(this.lat == 0 && this.lon == 0){
            return true;
        }else{
            let distance = this.distance(lat, lon, this.lat, this.lon);
            if(distance > 0.5){ //  > 500 meters
                return true;
            }else{
                return false;
            }
        }
    }

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::                                                                         :::
    //:::  This routine calculates the distance between two points (given the     :::
    //:::  latitude/longitude of those points). It is being used to calculate     :::
    //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
    //:::                                                                         :::
    //:::  Definitions:                                                           :::
    //:::    South latitudes are negative, east longitudes are positive           :::
    //:::                                                                         :::
    //:::  Passed to function:                                                    :::
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::
    //:::                                                                         :::
    //:::  Worldwide cities and other features databases with latitude longitude  :::
    //:::  are available at https://www.geodatasource.com                         :::
    //:::                                                                         :::
    //:::  For enquiries, please contact sales@geodatasource.com                  :::
    //:::                                                                         :::
    //:::  Official Web site: https://www.geodatasource.com                       :::
    //:::                                                                         :::
    //:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
    //:::                                                                         :::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    distance(lat1, lon1, lat2, lon2, unit = 'K'): number {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

}