import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + "user/"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_EXPIRING_TiME = 3600

  private tokenTimer: any;
  private _token:string
  private isAuthenticated = false
  private _authStatusListener = new Subject<boolean>()

  constructor(private http:HttpClient, private router:Router) { }

  //token getter
  get token(){
    return this._token
  }

  getIsAuth(){
    return this.isAuthenticated
  }

  //authStatus getter
  getAuthStatusListener(){
    return this._authStatusListener.asObservable()
  }

  //signup new user
  signUp(newUser: FormData){
    this.http.post(BACKEND_URL + "newUser", newUser)
      .subscribe((response) => {
        const token = response['token']
        this._token = token
        if(token){
          this.tokenTimer = setTimeout(() => {
            this.logout()
          }, this.AUTH_EXPIRING_TiME * 1000);

          this.isAuthenticated = true
          this._authStatusListener.next(true)
          this.router.navigate(["/"])
        }
      },(error) => {
        this._authStatusListener.next(false)
      })
  }

  //login user
  login(user){
    this.http.post(BACKEND_URL + "login", user)
      .subscribe((response) => {
        const token = response['token']
        this._token = token
        if(token){
          this.setAuthTimer(this.AUTH_EXPIRING_TiME)

          this.isAuthenticated = true
          this._authStatusListener.next(true)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + this.AUTH_EXPIRING_TiME*1000)

          this.saveAuthData(token, expirationDate)
          this.router.navigate(["/"])
        }

      },(error) => {
        this._authStatusListener.next(false)
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
    }
  }

  //logout
  logout(){
    this.http.post(BACKEND_URL + "logout", null)
      .subscribe((response) => {
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

  //get Local AuthData
  getLocalAuthData(){
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    if(!token && !expirationDate)
      return;

    return {
      token:token,
      expirationDate: new Date(expirationDate)
    }
  }

  //set auth timer
  private setAuthTimer(duration: number){
    console.log('setting timer :', duration);

    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  //saving atuh token to local storage
  private saveAuthData(token:string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
  }

  //clearing atuh token to local storage
  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
  }

}
