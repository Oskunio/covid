import { Statistics } from './../../models/statistics.model';
import { WebService } from './../../services/web.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  selected = 'week';
  myControl = new FormControl('Poland');
  filteredOptions: Observable<string[]>;

  constructor(private webService: WebService) { }

  ngOnInit(): void {
    this.getCountryHistoryStatistics('Poland');
    this.getCountries();
    this.initChart();
    this.filteredOptions = this.myControl.valueChanges
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

      for(let i=this.length-8; i < this.length-1;i++){
        this.labels.push(this.statistics[i].day);
        this.newCases.push(Number(this.statistics[i].cases.new));
        this.deaths.push(Number(this.statistics[i].deaths.new));
      }
      this.chart.update();
      console.log(this.deaths);
      console.log(this.newCases);
      console.log(this.labels);
    });
  }

  getCountries() {
    this.webService.getCountries().subscribe((res: any) => {
      this.countries = res.response;
      console.log(this.countries);
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
                      autoSkip: true,
                      maxTicksLimit: 7
                  }
              }]
          }
      }
  });
  }


}
