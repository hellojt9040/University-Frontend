import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
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
            media:post.media? BACKEND_URL + post._id +"/media":undefined,
            owner:post.owner
          }
        }),totalPostsLength: postData.totalPostsLength}
      }))
      .subscribe((transformedPost) => {
        this.posts = [...transformedPost.posts]
        this.postUpdated.next({posts:[...this.posts], postCount:transformedPost.totalPostsLength})
      },(error) => {
        console.error(error)
      })

  }

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
  addPost(title:string, description:string, media?:string) {
    let post:Post = { id:'', title, description, media }

    this.http.post<{message:string}>(BACKEND_URL, post)
      .subscribe((response) => {
        if(!post.media)
          post.media = undefined

        this.posts.push(post)

        this.postUpdated.next({posts:[...this.posts]})
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
      return false

    this.http.delete<{success:string}>(BACKEND_URL + id)
      .subscribe((response) => {
        for(let post of this.posts) {
          if(id===post.id){
            let index = this.posts.indexOf(post)
            this.posts.splice(index,1)
            this.postUpdated.next({posts:[...this.posts]})
            console.log(`Post id: ${id} deleted ${response.success}`)
          }
        }
      },(error) => {
        console.log(error.message)
      })
  }

}
