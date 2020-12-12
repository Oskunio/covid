import { map, startWith } from 'rxjs/operators';
import { StatisticsService } from './../../services/statistics.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  // controls
  selectedPeriod = 'week';
  selectedCountry = new FormControl('Poland');
  filteredOptions: Observable<string[]>;
  //data
  countries: string[] = [];

  constructor(private webService: WebService, private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.getCountries();
    this.filteredOptions = this.selectedCountry.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCountries() {
    this.webService.getCountries().subscribe((res: any) => {
      this.countries = res.response;
      console.log(this.countries);
    });
  }
  sendSelectedPeriod() {
    this.statisticsService.selectedPeriod = this.selectedPeriod;
    this.statisticsService.sendSelectedPeriod();
  }
  sendSelectedCountry() {
    this.statisticsService.selectedCountry = this.selectedCountry.value;
    this.statisticsService.getCountryHistoryStatistics();
  }


}
