export class UnitConvertor {

    kelvinToCelsius(kelvin){
        return Math.round((kelvin - 272.15) * 100) / 100;
    }
}