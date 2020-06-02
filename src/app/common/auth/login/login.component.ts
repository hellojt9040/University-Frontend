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

  constructor(private authService:AuthService) { }

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
    if((loginForm.value.facultyCode as string) == environment.facultySecurityCode)
      this.authService.facultyLogin({...loginForm.value})

    return false
//TODO: else student service call    /* this.authService.studentLogin({...loginForm.value}) */
  }

  trueFaculty(){
    this.isFaculty = true
  }
}
