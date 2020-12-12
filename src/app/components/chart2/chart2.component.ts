import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Statistics } from 'src/app/models/statistics.model';

@Component({
  selector: 'app-chart2',
  templateUrl: './chart2.component.html',
  styleUrls: ['./chart2.component.scss']
})
export class Chart2Component implements OnInit {
  // data
  statistics: Statistics[];

  //chart
  chart2: Chart;
  labels: string[] = [];
  deaths: number[] = [];
  cases: number[] = [];

  // filter
  selectedPeriod = 'week';
  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.getSelectedPeriod();
    this.getStatistics();
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

  initChart() {
    this.chart2 = new Chart('myChart2', {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [{
            label: 'cases',
            data: this.cases,
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
        title: {
          display: true,
          text: 'Total cases and deaths chart'
      },
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
        this.cases.push(Number(this.statistics[i].cases.total));
        this.deaths.push(Number(this.statistics[i].deaths.total));
      }
      this.chart2.data.datasets[0].data = this.cases;
      this.chart2.data.datasets[1].data = this.deaths;
      this.chart2.data.labels = this.labels
      this.chart2.update();

  }

  setTimePeriod() {
    this.labels = [];
    this.cases = [];
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
