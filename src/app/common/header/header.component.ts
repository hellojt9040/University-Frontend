import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription
  private isFacultyListenerSubs: Subscription

  userIsAuthenticated = false
  userIsFaculty:boolean

  constructor(private authService: AuthService) { }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      })

    this.userIsFaculty = this.authService.getIsFaculty()
    console.log(this.userIsFaculty);

    this.isFacultyListenerSubs = this.authService
      .getIsFacultyStatusListener()
      .subscribe((isFaculty) => {
        this.userIsFaculty = isFaculty
        console.log(this.userIsFaculty);

      })
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
    this.isFacultyListenerSubs.unsubscribe()
  }

  //logout
  onLogout(){
    this.authService.logout()
  }

}
