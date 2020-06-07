import { ErrorComponent } from './../../error/error.component';
import { MatDialog } from '@angular/material/dialog';
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
  //signupForm:FormGroup

  constructor(private authService:AuthService, private dialog: MatDialog) { }

  signupForm = new FormGroup({

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
    // TODO:
    student: new FormGroup({
      // student signup form
      userName: new FormControl('',{
        validators: [
          Validators.required,
          Validators.minLength(4),
        ]
      }),
      rollNo: new FormControl('',{
        validators: [Validators.required]
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
      branch: new FormControl('',{
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
  })

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

  checkTrueFaculty(key){
    if(!key.value)
      return

    if(key.value === environment.facultySecurityCode){
      this.isTrueFaculty = true
      return true

    }
    this.isTrueFaculty = false
    this.dialog.open(ErrorComponent, {data: {message:'Wrong Faculty Security Key !!'}})
    this.isLoading = false

  }

  onSignup(signupForm:FormGroup){
    if(this.signupForm.get('faculty').invalid && this.signupForm.get('student').invalid){
      return
    }
    this.isLoading = true
    let newUser

    this.checkTrueFaculty(this.facultySecurityCode)

    if(this.isTrueFaculty == true){
      newUser = new FormData()
      newUser.append('facultyName', signupForm.value.faculty.userName)
      newUser.append('email', signupForm.value.faculty.email)
      newUser.append('password', signupForm.value.faculty.password)
      newUser.append('gender', signupForm.value.faculty.gender)
      newUser.append('primaryContact', signupForm.value.faculty.primaryContact)
      newUser.append('avatar', signupForm.value.faculty.avatar)

      this.authService.facultySignUp(newUser)
    }

    if(this.isFaculty.value === ""){
      newUser = new FormData()
      newUser.append('studentName', signupForm.value.student.userName)
      newUser.append('email', signupForm.value.student.email)
      newUser.append('password', signupForm.value.student.password)
      newUser.append('gender', signupForm.value.student.gender)
      newUser.append('primaryContact', signupForm.value.student.primaryContact)
      newUser.append('rollNo', signupForm.value.student.rollNo as string)
      newUser.append('branch', signupForm.value.student.branch)
      newUser.append('avatar', signupForm.value.student.avatar)

      this.authService.studentSignUp(newUser)

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

      if(this.isFaculty.value == true){
        this.signupForm.patchValue({faculty:{avatar:file}})
        this.signupForm.get('faculty.avatar').updateValueAndValidity()
      }else {
        this.signupForm.patchValue({student:{avatar:file}})
        this.signupForm.get('student.avatar').updateValueAndValidity()
      }

    }
    reader.readAsDataURL(file)
  }

  resetStudent(){
    this.signupForm.get('student').reset()
    this.signupForm.get('faculty').reset()
    this.imagePreview = ''
  }


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
