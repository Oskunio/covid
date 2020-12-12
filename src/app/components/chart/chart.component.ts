import { Statistics } from './../../models/statistics.model';
import { WebService } from './../../services/web.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  // data
  statistics: Statistics[];
  length: number;
  countries: string[] = [];

  //chart
  chart: Chart;
  labels: string[] = [];
  deaths: number[] = [];
  newCases: number[] = [];

  // controls
  selectedPeriod = 'week';
  selectedCountry = new FormControl('Poland');
  filteredOptions: Observable<string[]>;

  constructor(private webService: WebService) { }

  ngOnInit(): void {
    this.getCountryHistoryStatistics('Poland');
    this.getCountries();
    this.initChart();
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

  getCountryHistoryStatistics(country: string) {
    this.webService.getCountryHistoryStatistics(country).subscribe((res:any) => {
      this.length = res.results;
      this.statistics = res.response;
      // remove repetitions and null values
      for(let i=0;i<this.length-1;i++) {
        let day1 = this.statistics[i].day;
        let day2 = this.statistics[i+1].day;
        if(this.statistics[i].day == this.statistics[i+1].day) {

          if(this.statistics[i].cases.new == null) {
            this.statistics.splice(i,1);
          } else if(this.statistics[i+1].cases.new == null) {
            this.statistics.splice(i+1,1);
          } else {
            this.statistics.splice(i,1);
          }
          this.length--;
          i--;
        }
      }

      this.timePeriodSelected();

      // console.log(this.deaths);
      // console.log(this.newCases);
      // console.log(this.labels);
    });
  }

  getCountries() {
    this.webService.getCountries().subscribe((res: any) => {
      this.countries = res.response;
    });
  }

  initChart() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [{
            label: 'new cases',
            data: this.newCases,
            borderColor: '#5158d6',
            backgroundColor: '#151ca3',
            fill:'false'
          },
          {
            label: 'deaths',
            data: this.deaths,
            borderColor: '#8a0808',
            backgroundColor: '#81088a',
            fill:'false'
          }],
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                  }
              }],
              xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }]
          }
      }
  });
  }

  setTimePeriod(time: number) {
    for(let i=time-1; i >= 0;i--){
        this.labels.push(this.statistics[i].day);
        this.newCases.push(Number(this.statistics[i].cases.new));
        this.deaths.push(Number(this.statistics[i].deaths.new));
      }
      this.chart.data.datasets[0].data = this.newCases;
      this.chart.data.datasets[1].data = this.deaths;
      this.chart.data.labels = this.labels
      this.chart.update();

  }

  timePeriodSelected() {
    this.labels = [];
    this.newCases = [];
    this.deaths = [];
    if(this.selectedPeriod == 'week') {
      this.setTimePeriod(7);
    } else if(this.selectedPeriod == 'month') {
      this.setTimePeriod(30);
    } else if(this.selectedPeriod == 'all') {
      this.setTimePeriod(this.statistics.length);
    }
  }

  selectCountry() {
    this.getCountryHistoryStatistics(this.selectedCountry.value);
  }

}
