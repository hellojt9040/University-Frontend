import { MyLocationComponent } from './common/my-location/my-location.component';
import { ViewResultsComponent } from './users/view-results/view-results.component';
import { AboutUsComponent } from './common/about-us/about-us.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPostsComponent } from './posts/view-posts/view-posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { LoginComponent } from './common/auth/login/login.component';
import { SignupComponent } from './common/auth/signup/signup.component';
import { ResUploadComponent } from './users/res-upload/res-upload.component';
import { AuthGuard } from './common/auth/auth.guard';
import { ProfileComponent } from './users/profile/profile.component';
import { TimeTableComponent } from './common/time-table/time-table.component';


const routes: Routes = [
  {path: '' , redirectTo: 'posts',pathMatch: 'full', canActivate:[AuthGuard]},
  {path: 'posts' ,pathMatch: 'full', component: ViewPostsComponent, canActivate:[AuthGuard]},
  {path: 'addPost' ,pathMatch: 'full', component: CreatePostComponent,canActivate:[AuthGuard]},
  {path: 'editPost/:id' ,pathMatch: 'full', component: EditPostComponent},
  {path: 'resultUpload', pathMatch: 'full', component: ResUploadComponent, canActivate:[AuthGuard]},
  //{path: 'aboutUs', pathMatch: 'full', component: AboutUsComponent},
  {path: 'profile', pathMatch: 'full', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'viewResults', pathMatch: 'full', component: ViewResultsComponent, canActivate:[AuthGuard]},
  {path: 'myLocation', pathMatch: 'full', component: MyLocationComponent, canActivate:[AuthGuard]},
  {path: 'timeTable', pathMatch: 'full', component: TimeTableComponent, canActivate:[AuthGuard]},
  {path: 'login', pathMatch: 'full', component: LoginComponent},
  {path: 'signup', pathMatch: 'full', component: SignupComponent},
  {path: '**', component: NotFoundComponent},

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,)
  ],
  providers: [
    AuthGuard
  ],
  //exports: [RouterModule]
})
export class RoutingModule { }
