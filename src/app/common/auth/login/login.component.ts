import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './../../error/error.component';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false
  isFaculty = false
  private authListenerSubs: Subscription

  private isTrueFaculty = false


  constructor(private authService:AuthService, private dialog: MatDialog) { }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

  ngOnInit(){
    //gettig auth status
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe((authStaus) => {
        this.isLoading = false
      })

  }

  onLogin(loginForm: NgForm){
    this.isLoading = false
    if(loginForm.invalid)
      return

    this.isLoading = true
    this.checkTrueFaculty(loginForm.value.facultyCode as string)

    if(this.isTrueFaculty == true){
      return this.authService.facultyLogin({...loginForm.value})
    }

    this.authService.studentLogin({...loginForm.value})
//TODO: else student service call    /* this.authService.studentLogin({...loginForm.value}) */
  }

  trueFaculty(){
    this.isFaculty = true
  }

  checkTrueFaculty(key){
    if(!key)
      return

    if(key === environment.facultySecurityCode){
      this.isTrueFaculty = true
      return true

    }
    this.isTrueFaculty = false
    this.dialog.open(ErrorComponent, {data: {message:'Wrong Faculty Security Key !!'}})
    this.isLoading = false

  }
}
