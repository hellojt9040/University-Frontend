import { AuthService } from 'src/app/common/auth/auth.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  hide = true
  isOtpValid = false
  isOptSent=false
  isLoading=false
  isPasswordUpdated:boolean = false

  userIsFaculty:boolean
  private isFacultyListenerSubs: Subscription

  resetPasswordForm: FormGroup = new FormGroup({})

  constructor(
    private userService:UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {userAuthyId:string}) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    })

    this.userIsFaculty = this.authService.getIsFaculty()
    this.isFacultyListenerSubs = this.authService
    .getIsFacultyStatusListener()
    .subscribe((isFaculty) => {
      this.userIsFaculty = isFaculty
    })
  }

  ngOnDestroy(){
    this.isFacultyListenerSubs.unsubscribe()
  }

  //sending otp for restting password
  sendOtp(contactNo){
    this.isLoading = true
    let contactData = {
      userAuthyId:this.data.userAuthyId,
      primaryContact:contactNo,
      userIsFaculty:this.userIsFaculty
    }

    this.userService.sendOtp(contactData)
      .subscribe((response) => {
        this.isLoading = false
        this.isOptSent = true
      })
  }

  // verifying opt
  varifyOtp(OTP){
    this.isLoading = true
    let otpData = {
      userAuthyId:this.data.userAuthyId,
      token:OTP
    }
    this.userService.verifyOtp(otpData)
    .subscribe((response) => {
      this.isLoading = false
      this.isOtpValid = true
    })
  }

  get f(){
    return this.resetPasswordForm.controls;
  }

  submit(){
    let passwordData
    if (this.userIsFaculty) {
      passwordData = {
        password:this.resetPasswordForm.value.password,
        facultyAuthyId:this.data.userAuthyId
      }
    } else {
      passwordData = {
        password:this.resetPasswordForm.value.password,
        studentAuthyId:this.data.userAuthyId
      }
    }

    this.userService.resetPassword(passwordData)
      .subscribe((response) => {
        this.isPasswordUpdated = true
        setTimeout(()=> {
          this.dialogRef.close()
          this.authService.logout()
        },500)
      })
  }
}
