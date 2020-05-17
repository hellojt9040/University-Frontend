import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../validators/mime-type.validator';
import { UsernameValidator } from './username.validator'
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false

  private authListenerSubs: Subscription
  imagePreview: string
  signupForm:FormGroup

  constructor(private authService:AuthService) { }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

  ngOnInit(){

    this.signupForm = new FormGroup({
      userName: new FormControl('',{
        validators: [
          Validators.required,
          Validators.minLength(4),
          UsernameValidator.canNotContainSpace
        ]
      }),
      email: new FormControl('',{
        validators: [Validators.required],
        asyncValidators: []
      }),
      password: new FormControl('',{
        validators: [Validators.required, Validators.minLength(5)]
      }),
      avatar: new FormControl('', {
        validators: [Validators.required],    //required validaot is requred, else
        asyncValidators:[mimeType]
      })
    })

    //gettig auth status
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe((authStaus) => {
        this.isLoading = false
      })
  }

  onSignup(signupForm:FormGroup){
    if(signupForm.invalid)
      return

    this.isLoading = true

    const newUser = new FormData()
    newUser.append('userName', signupForm.value.userName)
    newUser.append('email', signupForm.value.email)
    newUser.append('password', signupForm.value.password)
    newUser.append('avatar', signupForm.value.avatar)

    this.authService.signUp(newUser)
  }

  onFilePicked(event: Event){
    const file:File = (event.target as HTMLInputElement).files[0]

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = (reader.result as string)
      this.signupForm.patchValue({avatar:file})
      this.signupForm.get('avatar').updateValueAndValidity()
    }
    reader.readAsDataURL(file)
  }

  /* uploadNewAvatar(avatar:File){
    this.userService.uploadNewAvatar({avatar})
  } */

  //getters
  get userName(){
    return this.signupForm.get('userName')
  }
  get email(){
    return this.signupForm.get('email')
  }
  get password(){
    return this.signupForm.get('password')
  }
  get avatar(){
    return this.signupForm.get('avatar')
  }

  getErrorMessage(field:string) {
    if (this.signupForm.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
