import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + "faculty/"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_EXPIRING_TiME = 3600

  private tokenTimer: any;
  private _token:string
  private isAuthenticated = false
  private isFaculty = false
  private _authStatusListener = new Subject<boolean>()
  private _isFacultyStatusListener = new Subject<boolean>()



  constructor(private http:HttpClient, private router:Router) { }

  //token getter
  get token(){
    return this._token
  }

  getIsAuth(){
    return this.isAuthenticated
  }

  getIsFaculty(){
    return this.isFaculty
  }

  //authStatus getter
  getAuthStatusListener(){
    return this._authStatusListener.asObservable()
  }

  //isFacultyStatus getter
  getIsFacultyStatusListener(){
    return this._isFacultyStatusListener.asObservable()
  }

  //signup new faculty
  facultySignUp(newUser: FormData){
    this.http.post(BACKEND_URL + "newFaculty", newUser)
      .subscribe((response) => {
        this.isFaculty = true

        const token = response['token']
        this._token = token
        if(token){
          this.tokenTimer = setTimeout(() => {
            this.logout()
          }, this.AUTH_EXPIRING_TiME * 1000);

          this.isAuthenticated = true
          this._authStatusListener.next(true)
          this._isFacultyStatusListener.next(true)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + this.AUTH_EXPIRING_TiME*1000)

          this.saveAuthData(token, expirationDate, this.isFaculty)
          this.router.navigate(["/"])
        }
      },(error) => {
        this._authStatusListener.next(false)
        this._isFacultyStatusListener.next(false)
      })
  }

  //signup new student user
  studentSignUp(newUser){
    const URL  = BACKEND_URL.replace('faculty/','student/')

    this.http.post(URL + "newStudent", newUser)
      .subscribe((response) => {
        this.isFaculty = false

        const token = response['token']
        this._token = token
        if(token){
          this.tokenTimer = setTimeout(() => {
            this.logout()
          }, this.AUTH_EXPIRING_TiME * 1000);

          this.isAuthenticated = true
          this._authStatusListener.next(true)
          this._isFacultyStatusListener.next(false)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + this.AUTH_EXPIRING_TiME*1000)

          this.saveAuthData(token, expirationDate, this.isFaculty)
          this.router.navigate(["/"])
        }
      },(error) => {
        console.log(error, 'stude err');

        this._authStatusListener.next(false)
        this._isFacultyStatusListener.next(false)
      })
  }


  //login user
  facultyLogin(user){
    this.http.post(BACKEND_URL + "login", user)
      .subscribe((response) => {
        this.isFaculty = true

        const token = response['token']
        this._token = token
        if(token){
          this.setAuthTimer(this.AUTH_EXPIRING_TiME)

          this.isAuthenticated = true
          this._authStatusListener.next(true)
          this._isFacultyStatusListener.next(true)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + this.AUTH_EXPIRING_TiME*1000)

          this.saveAuthData(token, expirationDate, this.isFaculty)
          this.router.navigate(["/"])
        }

      },(error) => {
        this._authStatusListener.next(false)
        this._isFacultyStatusListener.next(false)
      })
  }

  //student login
  studentLogin(user){
    const URL  = BACKEND_URL.replace('faculty/','student/')
    this.http.post(URL + "login", user)
      .subscribe((response) => {
        this.isFaculty = false

        const token = response['token']
        this._token = token
        if(token){
          this.setAuthTimer(this.AUTH_EXPIRING_TiME)

          this.isAuthenticated = true
          this._authStatusListener.next(true)
          this._isFacultyStatusListener.next(false)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + this.AUTH_EXPIRING_TiME*1000)

          this.saveAuthData(token, expirationDate, this.isFaculty)
          this.router.navigate(["/"])
        }

      },(error) => {
        console.log(error, 'stu login err');

        this._authStatusListener.next(false)
        this._isFacultyStatusListener.next(false)
      })
  }

  //auto checking login
  autoAuthUser(){
    const authInformation = this.getLocalAuthData()
    if(!authInformation)
      return
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if(expiresIn > 0){
      this._token = authInformation.token
      this.isAuthenticated = true
      this.setAuthTimer(expiresIn / 1000)
      this._authStatusListener.next(true)
      if(authInformation.isFaculty === "true"){
        this.isFaculty=true
        this._isFacultyStatusListener.next(true)
      }
    }
  }

  //logout
  logout(){
    if (this.isFaculty) {
      //faculty logout
      this.http.post(BACKEND_URL + "logout", null)
      .subscribe((response) => {
        this._isFacultyStatusListener.next(false)
        this._token = null
        this.isAuthenticated = false
        this._authStatusListener.next(false)
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.router.navigate(["/"])
      },(error) => {
          console.error(error);
      })
    } else {
      //student logout
      const URL = BACKEND_URL.replace('faculty/','student/')
      this.http.post(URL + "logout", null)
      .subscribe((response) => {
        this._isFacultyStatusListener.next(false)
        this._token = null
        this.isAuthenticated = false
        this._authStatusListener.next(false)
        clearTimeout(this.tokenTimer)
        this.clearAuthData()
        this.router.navigate(["/"])
      },(error) => {
          console.error(error);
      })
    }
  }

  //get Local AuthData
  getLocalAuthData(){
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    const isFaculty = localStorage.getItem("isFaculty")
    if(!token && !expirationDate)
      return;

    return {
      token:token,
      expirationDate: new Date(expirationDate),
      isFaculty
    }
  }

  //get user profile data
  getUserProfileData(isFaculty, userId){
    let URL = BACKEND_URL

    if(!isFaculty){
      URL = BACKEND_URL.replace("faculty/","student/")
    }
    return this.http.get(URL+ 'getProfileData/' + userId)

  }

  //set auth timer
  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  //saving atuh token to local storage
  private saveAuthData(token:string, expirationDate: Date, isFaculty?:boolean) {
    let trueFaculty: string = (isFaculty) ?'true': 'false'
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('isFaculty', trueFaculty)
  }

  //clearing atuh token to local storage
  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('isFaculty')
  }

}
