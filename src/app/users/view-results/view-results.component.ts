import { UserService } from './../user.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent implements OnInit, OnDestroy {
  private studentResultData
  isResultAvailable = false
  private resultListenerSubs: Subscription

  displayedColumns: string[] = ['name', 'semester', 'contact', 'subject', 'markScored', 'fullMark', 'passMark', 'persentage'];
  dataSource

  constructor(private userService:UserService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resultAvailable(flag){
    this.isResultAvailable = true
  }

  ngOnInit(){
    this.userService.getResults()
    this.resultListenerSubs = this.userService
      .getResultUpdated()
      .subscribe((resultData) => {
        if(resultData['resultDataArray'].length){
          this.isResultAvailable = true
          this.resultAvailable(true)
        }

        const resultDataArray = resultData['resultDataArray']

        this.studentResultData = resultDataArray
        this.dataSource = new MatTableDataSource(resultDataArray)
      },(error) => {
        this.isResultAvailable = false
      })
  }

  ngOnDestroy(){
    this.resultListenerSubs.unsubscribe()
  }

}
