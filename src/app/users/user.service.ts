import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiURL + "aboutUs"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) {

  }

  uploadNewAvatar(avatar:{avatar:File}){
    const newAvatar = new FormData()
    newAvatar.append('avatar', avatar.avatar,)

    this.http.post<{message:string}>(BACKEND_URL, newAvatar)
      .subscribe((response) => {
        console.log(`Avatar updated ${response.message}`);
      },(error) => {
        console.log(error.message);
      })
  }



}
