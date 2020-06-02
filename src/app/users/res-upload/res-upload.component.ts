import { Subscription, Subject } from 'rxjs';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { map, buffer } from 'rxjs/operators';


const dataaaa= [
  {name:'abcd', semester:'1', contact:'contact', subject:'subject', markScored:'markScored', fullMark:'fullMark', passMark:'passMark', persentage:'persentage'},
  {name:'abcd', semester:'2', contact:'contact', subject:'subject', markScored:'markScored', fullMark:'fullMark', passMark:'passMark', persentage:'percentage'}
]

@Component({
  selector: 'res-upload',
  templateUrl: './res-upload.component.html',
  styleUrls: ['./res-upload.component.css']
})



export class ResUploadComponent implements OnInit {
  /* isResultUploaded: boolean
  private isResultUploadedListenerSubs: Subscription; */

  /* public destroyed = new Subject<any>();  */



  private studentResultData
  isResultAvailable = false

  private resultListenerSubs: Subscription

  constructor(private userService:UserService) { }


  displayedColumns: string[] = ['name', 'semester', 'contact', 'subject', 'markScored', 'fullMark', 'passMark', 'persentage'];
  dataSource

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resultAvailable(flag){
    this.isResultAvailable = true
  }

  ngOnInit(): void {

    this.userService.getResults()

    this.resultListenerSubs = this.userService
      .getResultUpdated()
      .subscribe((resultData) => {
        if(resultData['resultDataArray'].length){
          this.isResultAvailable = true
          this.resultAvailable(true)
        }
        //this.isResultAvailable = false

        const resultDataArray = resultData['resultDataArray']

        this.studentResultData = resultDataArray
        this.dataSource = new MatTableDataSource(resultDataArray)
      },(error) => {
        this.isResultAvailable = false
      })




    /* this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe((data) => {
      // this.fetchData();
      console.log(data, 'data');
      this.router.navigate(["/resultUpload"])

    }) */

        /* this.isResultUploaded = this.userService.getIsResultUploaded()
        this.isResultUploadedListenerSubs = this.userService
          .getAuthStatusListener()
          .subscribe((isResultUploaded) => {
            console.log(isResultUploaded,'isResultUploaded');
            this.isResultUploaded = isResultUploaded
          })
      } */

  }

  ngOnDestroy(){
    this.resultListenerSubs.unsubscribe()
  }
}
