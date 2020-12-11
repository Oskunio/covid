import { Statistics } from './../../models/statistics.model';
import { WebService } from './../../services/web.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  statistics: Statistics[];
  selectedCountry = 'usa';
  chart: Chart;
  labels: string[] = [];
  dataset: number[] = [];
  length: number;
  constructor(private webService: WebService) { }

  ngOnInit(): void {
    this.getCountryHistoryStatistics(this.selectedCountry);
    this.initChart();
  }

  getCountryHistoryStatistics(country: string) {
    this.webService.getCountryHistoryStatistics(country).subscribe((res:any) => {
      this.length = res.results;
      this.statistics = res.response;

      for(let i=this.length-8; i < this.length-1;i++){
        this.labels.push(this.statistics[i].day);
        this.dataset.push(this.statistics[i].cases.active);
      }
      console.log(this.dataset);
      console.log(this.labels);
    });
  }

  initChart() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
          labels: this.labels,
          datasets: [{
            label: 'active cases',
            data: this.dataset,
            backgroundColor:  'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
  }

}
