import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/common/auth/auth.service';

import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy  {
  university = "Aryan"
  userIsAuthenticated = false
  userIsFaculty:boolean

  private authListenerSubs: Subscription
  private isFacultyListenerSubs: Subscription

  currentUser
  userProfilePic



  constructor(private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      })

    this.userIsFaculty = this.authService.getIsFaculty()

    this.isFacultyListenerSubs = this.authService
      .getIsFacultyStatusListener()
      .subscribe((isFaculty) => {
        this.userIsFaculty = isFaculty
      })

    this.getUserData()
  }

  getUserData(){
    const user = this.authService.getLocalAuthData()
    const token = user.token
    const decoded = jwt_decode(token) //jwt.verify(token, process.env.JWT_SECRET) //_id:decoded._id
    const userId = decoded._id

    this.authService.getUserProfileData(this.userIsFaculty, userId)
    .subscribe((response) => {
      this.currentUser = {...response}
      this.createUserAvatarUrl(this.userIsFaculty, this.currentUser._id)
    })
  }

  // create user avatar url for binding
  createUserAvatarUrl(isFaculty, userId){
    if(isFaculty)
      return this.userProfilePic = environment.apiURL + 'faculty/' + userId + '/avatar'
      
    this.userProfilePic = environment.apiURL + 'student/' + userId + '/avatar'
  }

  openResetPassword(){
    if(this.userIsFaculty)
      return this.dialog.open(ResetPasswordComponent, {data: {userAuthyId:this.currentUser['facultyAuthyId']}})

    this.dialog.open(ResetPasswordComponent, {data: {userAuthyId:this.currentUser['studentAuthyId']}})
  }


  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
    this.isFacultyListenerSubs.unsubscribe()
  }

}
