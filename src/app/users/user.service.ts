import { Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiURL + "faculty"

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _resultData

  /* private isResultUploaded = false
  private _isResultUploadedListener = new Subject<boolean>() */



  private resultUpdated = new Subject()

  constructor(private http:HttpClient, private router:Router) {

  }

  // getting instance of Subject as observable to see the
  getResultUpdated() {
    return this.resultUpdated.asObservable()
  }

  /* getIsResultUploaded(){
    return this.isResultUploaded
  }

  //auth isResultUploaded getter
  getAuthStatusListener(){
    return this._isResultUploadedListener.asObservable()
  } */

  uploadNewAvatar(avatar:{avatar:File}){
    const newAvatar = new FormData()
    newAvatar.append('avatar', avatar.avatar,)

    this.http.post<{message:string}>(BACKEND_URL, newAvatar)
      .subscribe((response) => {
        console.log(`Avatar updated ${response.message}`);
      },(error) => {
        console.log(error.message)
      })
  }

  uploadNewResultData(resultData){
    const URL = BACKEND_URL+'/resultUpload'
    const newResultData = new FormData()

    newResultData.append('name', resultData.name,)
    newResultData.append('size', resultData.size,)
    newResultData.append('type', resultData.type,)
    newResultData.append('resultFile', resultData.rawFile,)


    this.http.post(URL, newResultData)
      .subscribe((response) => {
        this.router.navigate(["/"])
      },(error) => {
        console.log(error);
      })
  }

  getResults(){
    this.http.get(BACKEND_URL+'/getStudentResults')
      .subscribe((response) => {

        this._resultData = {...response}
        this.resultUpdated.next(this._resultData)
      })
  }

  sendOtp(contactData){
    let URL
    if (contactData.userIsFaculty) {
      URL = BACKEND_URL+'/sendOtp'
    } else {
      URL = BACKEND_URL.replace('faculty','student') + '/sendOtp'
    }

    return this.http.post(URL, contactData)
  }

  verifyOtp(otpData){
    const URL = BACKEND_URL+'/verifyOtp'
    return this.http.post(URL, otpData)
  }

  resetPassword(passwordData){
    let URL

    if (passwordData['facultyAuthyId']) {
      URL = BACKEND_URL+'/resetPassword'
    } else {
      URL = BACKEND_URL.replace('faculty','student') + '/resetPassword'
    }

    return this.http.post(URL, passwordData)
  }

  get resultData(){
    return this._resultData
  }

  set resultData(resultData){
    this._resultData = resultData
  }

}
