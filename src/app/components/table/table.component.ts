import { TableData } from './../../models/table.data';
import { WebService } from './../../services/web.service';
import { Component, OnInit,  ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['location', 'population', 'cases', 'deaths', 'tests'];
  tableData:TableData[] = [];
  dataSource: MatTableDataSource<TableData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private webService: WebService) {
  }
  ngOnInit(): void {
    this.getStatistics();
  }


  getStatistics() {
    this.webService.getStatitics().subscribe((statistics:any) => {
      console.log(statistics.response);
      //let tableDataElement = new TableData();

      for(let s of statistics.response) {
        let tableDataElement = new TableData();
        tableDataElement.location = s.country;
        tableDataElement.population = s.population;
        tableDataElement.cases = s.cases.total;
        tableDataElement.deaths = s.deaths.total;
        tableDataElement.tests = s.tests.total;
        this.tableData.push(tableDataElement);
      }
      console.log(this.tableData);

      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



