import { mimeType } from './../../common/validators/mime-type.validator';
import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit{
  post : FormGroup
  constructor(private postsService:PostsService){

  }
  ngOnInit(){
    this.post = new FormGroup({
      title: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
      media:new FormControl('',)
    })
  }

  showDdArea: Boolean= false;
  imagePreview:string


  newPost:Post



  get title() {
    return this.post.get('title')
  }
  get description() {
    return this.post.get('description')
  }
  get media() {
    return this.post.get('media')
  }

  addPost(){
    this.postsService.addPost(this.title.value,this.description.value,this.media.value)
    this.post.reset()
  }

  getErrorMessage() {
    if (this.title.hasError('required')) {
      return 'You must enter a value';
    }
  }

  onFilePicked(event: Event){
    const file:File = (event.target as HTMLInputElement).files[0]

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string

      this.post.patchValue({media:file})
      this.post.get('media').updateValueAndValidity()
    }
    reader.readAsDataURL(file)
  }
}
