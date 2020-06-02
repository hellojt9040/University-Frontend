import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../validators/mime-type.validator';
import { UsernameValidator } from './username.validator'
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false
  private isTrueFaculty = false

  private authListenerSubs: Subscription
  imagePreview: string
  signupForm:FormGroup

  constructor(private authService:AuthService) { }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

  ngOnInit(){

    this.signupForm = new FormGroup({

      isFaculty: new FormControl('',{
        validators: [],
        asyncValidators: []
      }),

      faculty: new FormGroup({

        facultySecurityCode:new FormControl('',{
          validators: [Validators.required,],
          asyncValidators: []
        }),
        userName: new FormControl('',{
          validators: [
            Validators.required,
            Validators.minLength(4),
          ]
        }),
        email: new FormControl('',{
          validators: [Validators.required],
          asyncValidators: []
        }),
        password: new FormControl('',{
          validators: [Validators.required, Validators.minLength(5)]
        }),
        gender: new FormControl('',{
          validators: [Validators.required]
        }),
        primaryContact: new FormControl('',{
          validators: [
            Validators.required,
            Validators.pattern('[0-9]{10}')
          ]
        }),
        avatar: new FormControl('', {
          validators: [Validators.required], //required validaot is requred for mime type valid, else
          asyncValidators:[mimeType]
        })
      }),

      /* // TODO:
      student: new FormGroup({
        // student signup form
      }) */


    })



    //gettig auth status
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe((authStaus) => {
        this.isLoading = false
      })
  }

  checkTrueFaculty(key){
    if(key == environment.facultySecurityCode){
      this.isTrueFaculty = true
      console.log(this.isTrueFaculty,'this.isTrueFaculty');
      return true

    }
    this.isTrueFaculty = false
  }

  onSignup(signupForm:FormGroup){
    if(signupForm.invalid){
      return
    }
    this.isLoading = true
//(loginForm.value.facultyCode as string) == environment.facultySecurityCode
    let newUser

    this.checkTrueFaculty(this.facultySecurityCode)  && this.isTrueFaculty

    if(this.signupForm.get('isFaculty').value ){
      newUser = new FormData()
      newUser.append('facultyName', signupForm.value.faculty.userName)
      newUser.append('email', signupForm.value.faculty.email)
      newUser.append('password', signupForm.value.faculty.password)
      newUser.append('gender', signupForm.value.faculty.gender)
      newUser.append('primaryContact', signupForm.value.faculty.primaryContact)
      newUser.append('avatar', signupForm.value.faculty.avatar)

      this.authService.facultySignUp(newUser)
    }

    /* //TODO: else student form data

    newUser = new FormData()
      newUser.append('studentName', signupForm.value.userName)
      newUser.append('email', signupForm.value.email)
      newUser.append('password', signupForm.value.password)
      newUser.append('sem', signupForm.value.sem)
      newUser.append('branch', signupForm.value.branch)
      newUser.append('course', signupForm.value.course)
      newUser.append('branch', signupForm.value.branch)

    this.authService.studentSignUp(newUser) */


  }



  onFilePicked(event: Event){
    const file:File = (event.target as HTMLInputElement).files[0]

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string

      this.signupForm.patchValue({faculty:{avatar:file}})
      //(this.signupForm.controls['faculty'].at(1)).patchValue({avatar: file});
      this.signupForm.get('faculty.avatar').updateValueAndValidity()
    }
    reader.readAsDataURL(file)
  }

  /* uploadNewAvatar(avatar:File){
    this.userService.uploadNewAvatar({avatar})
  } */


  //getters
  get isFaculty(){
    return this.signupForm.get('isFaculty')
  }
  get facultySecurityCode(){
    return this.signupForm.get('faculty.facultySecurityCode')
  }
  get userName(){
    return this.signupForm.get('faculty.userName')
  }
  get email(){
    return this.signupForm.get('faculty.email')
  }
  get password(){
    return this.signupForm.get('faculty.password')
  }
  get avatar(){
    return this.signupForm.get('faculty.avatar')
  }


  getErrorMessage(field:string) {
    if (this.signupForm.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
