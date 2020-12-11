import { Statistics } from './../../models/statistics.model';
import { WebService } from './../../services/web.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  statistics: Statistics[];
  constructor(private webService: WebService) { }

  ngOnInit(): void {
    this.getStatistics();
  }
  getStatistics() {
    this.webService.getStatitics().subscribe((res: any) => {
      this.statistics = res.response;
      console.log(this.statistics);
    });
  }

}
