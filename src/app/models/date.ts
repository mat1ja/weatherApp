import * as moment from 'moment';
import 'moment/locale/hr';


export class DateService {

    setLocalization(lng = 'hr'){
        moment.locale(lng);
    }

    timestampToDateTime(date){
        let date_mom = moment(date, 'X');
        return date_mom.format('DD.MM.YYYY. HH:mm');
    }

    timestampToTime(date){
      let date_mom = moment(date, 'X');
      return date_mom.format('HH:mm');
  }

}