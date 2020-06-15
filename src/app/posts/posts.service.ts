import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, buffer } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiURL + "posts/"

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts:Post[] = []
  _totalPostsLength: number

  private postUpdated = new Subject<{posts:Post[],postCount?:number}>()


  constructor(private http:HttpClient, private router:Router){
    
  }




  // GET request
  getPosts(postPerPage: number = 5 , currentPage: number = 1){
    const queryURL = `?pagesize=${postPerPage}&currentpage=${currentPage}`

    this.http.get<{message:string, posts:any, totalPostsLength: number}>
    (BACKEND_URL + queryURL)
      .pipe(map(( postData ) => {
        return {posts:postData.posts.map((post) => {
          return {
            id:post._id,
            title:post.title,
            description:post.description,
            media:post.media,
            owner:post.owner,
            updatedAt: this.refactorUpadetedTime(post.updatedAt)
          }
        }),totalPostsLength: postData.totalPostsLength}
      }))
      .subscribe((transformedPost) => {
        this.posts = [...transformedPost.posts].reverse()

        this.postUpdated.next({posts:[...this.posts], postCount:transformedPost.totalPostsLength})
      },(error) => {
        console.error(error)
      })

  }

  // GET post owner profile picture
  //postOwnerProfilePicture()

  //get a particular post
  getPost(id) {
    for (let post of this.posts) {
      if(post.id == id)
        return post;
    }
    return false;
  }



  // getting instance of Subject as observable to see the
  getPostUpdated() {
    return this.postUpdated.asObservable()
  }

  //POST request
  addPost(title:string, description:string, media?:File) {
    //let post:Post = { id:'', title, description, media }

    const newPost = new FormData()
    newPost.append('title', title)
    newPost.append('description', description)
    if(media)
      newPost.append('media', media, title)

    this.http.post<{message:string,createdPost}>(BACKEND_URL, newPost)
      .subscribe((response) => {
        this.router.navigate(["/"])
      })
  }

  //PATCH request
  editPost(post){
    this.http.patch<{message:string}>(BACKEND_URL + post.id, post)
      .subscribe((response) => {
        this.postUpdated.next({posts:[...this.posts]})
        console.log(`Post id: ${post.id} updated ${response.message}`)
        setTimeout(() => {
          this.router.navigate(["/"])
        },3000)
      },
      (error) => {
        console.log(error.message)
      })
  }

  //DELETE request
  deletePost(id:string) {
    let doDelete = confirm("Post will be deleted permanently !!");

    if(!doDelete)
      return throwError(false)

    return this.http.delete<{success:string}>(BACKEND_URL + id)
  }

  refactorUpadetedTime(updatedTime){
    updatedTime = (updatedTime as string).split('-')
    updatedTime[2]= updatedTime[2].substring(0, 2)
    updatedTime=updatedTime.join('-')
    return updatedTime
  }

}
