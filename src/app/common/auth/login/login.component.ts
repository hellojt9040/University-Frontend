import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false
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
    this.authService.login({...loginForm.value})
  }
}
