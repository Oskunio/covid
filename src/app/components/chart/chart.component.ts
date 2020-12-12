import { Statistics } from './../../models/statistics.model';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { StatisticsService } from 'src/app/services/statistics.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  // data
  statistics: Statistics[];

  //chart
  chart: Chart;
  labels: string[] = [];
  deaths: number[] = [];
  newCases: number[] = [];

  // filter
  selectedPeriod = 'week';
  //selectedCountry = 'Poland';
  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.getSelectedPeriod();
    this.getStatistics();
    //this.getSelectedCountry();
    this.initChart();
  }

  getStatistics() {
    this.statisticsService.getStatistics().subscribe((data: Statistics[]) => {
      this.statistics = data;
      this.setTimePeriod();
    });
  }
  getSelectedPeriod() {
    this.statisticsService.getSelectedPeriod().subscribe((data:string) => {
      this.selectedPeriod = data;
      this.setTimePeriod();
    });
  }
  // getSelectedCountry() {
  //   this.statisticsService.getSelectedCountry().subscribe((data: string) => {
  //     this.selectedCountry = data;
  //   });
  // }

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

  setChartDataPeriod(time: number) {
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

  setTimePeriod() {
    this.labels = [];
    this.newCases = [];
    this.deaths = [];
    if(this.selectedPeriod == 'week') {
      this.setChartDataPeriod(7);
    } else if(this.selectedPeriod == 'month') {
      this.setChartDataPeriod(30);
    } else if(this.selectedPeriod == 'all') {
      this.setChartDataPeriod(this.statistics.length);
    }
  }


}
