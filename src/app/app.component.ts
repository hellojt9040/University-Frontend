import { AuthService } from 'src/app/common/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'University Project';

  storedPosts:Post[] = []

  constructor(private authService:AuthService){}

  onPostAdded(post){
    this.storedPosts.push(post)
  }

  ngOnInit(){
    this.authService.autoAuthUser()
  }
}
