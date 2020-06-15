import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  unit: string;
  day: string;
  time: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {unit: 'SIT670', day: '22/01/2020', time: '5.00-6.00 PM'},
  {unit: 'SIT506', day: '22/01/2020', time: '2.00-4.00 PM'},
  {unit: 'SIT405', day: '22/01/2020', time: '4.00-5.00 PM'},
];

@Component({
  selector: 'time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
  displayedColumns: string[] = ['unit', 'day', 'time'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
