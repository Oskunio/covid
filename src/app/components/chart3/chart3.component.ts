import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { Statistics } from 'src/app/models/statistics.model';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.scss']
})
export class Chart3Component implements OnInit {

  // data
  statistics: Statistics[];

  //chart
  chart3: Chart;
  labels: string[] = [];
  activeCases: number[] = [];

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
    this.chart3 = new Chart('myChart3', {
      type: 'bar',
      data: {
          labels: this.labels,
          datasets: [{
            label: 'cases',
            data: this.activeCases,
            borderColor: '#5158d6',
            backgroundColor: '#151ca3',
            fill:'false'
          }],
      },
      options: {
        title: {
          display: true,
          text: 'Active cases chart'
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
        this.activeCases.push(Number(this.statistics[i].cases.active));
      }
      this.chart3.data.datasets[0].data = this.activeCases;
      this.chart3.data.labels = this.labels
      this.chart3.update();

  }

  setTimePeriod() {
    this.labels = [];
    this.activeCases = [];
    if(this.selectedPeriod == 'week') {
      this.setChartDataPeriod(7);
    } else if(this.selectedPeriod == 'month') {
      this.setChartDataPeriod(30);
    } else if(this.selectedPeriod == 'all') {
      this.setChartDataPeriod(this.statistics.length);
    }
  }

}
