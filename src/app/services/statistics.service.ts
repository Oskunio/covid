import { WebService } from './web.service';
import { Injectable } from '@angular/core';
import { Statistics } from '../models/statistics.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
   // data
   statistics: Statistics[];
   selectedPeriod = 'week';
   selectedCountry = 'Poland';

   // subjects
   statisticsSub = new Subject();
   selectedPeriodSub = new Subject();
   //selectedCountrySub = new Subject();
  constructor(private webService: WebService) {
    this.getCountryHistoryStatistics();
   }

  //-------------- get data from server methods----------------


  getCountryHistoryStatistics() {
    this.webService.getCountryHistoryStatistics(this.selectedCountry).subscribe((res:any) => {
      let length = res.results;
      this.statistics = res.response;
      // remove repetitions and null values
      for(let i=0;i<length-1;i++) {
        if(this.statistics[i].day == this.statistics[i+1].day) {

          if(this.statistics[i].cases.new == null) {
            this.statistics.splice(i,1);
          } else if(this.statistics[i+1].cases.new == null) {
            this.statistics.splice(i+1,1);
          } else {
            this.statistics.splice(i,1);
          }
          length--;
          i--;
        }
      }
      this.sendStatistics();
    });
  }

  // -----------------subjects methods---------------------
  getStatistics() {
    return this.statisticsSub.asObservable();
  }
  getSelectedPeriod() {
    return this.selectedPeriodSub.asObservable();
  }
  // getSelectedCountry() {
  //   return this.selectedCountrySub.asObservable();
  // }
  sendStatistics() {
    this.statisticsSub.next(this.statistics);
  }
  sendSelectedPeriod() {
    this.selectedPeriodSub.next(this.selectedPeriod);
  }
//   sendSelectedCountry() {
//     this.selectedCountrySub.next(this.selectedCountry);
//   }
}
