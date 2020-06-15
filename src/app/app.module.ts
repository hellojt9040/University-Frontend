import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing.module';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';

import { AppComponent } from './app.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { HeaderComponent } from './common/header/header.component';
import { ViewPostsComponent } from './posts/view-posts/view-posts.component';
import { FileUploadComponent } from './common/upload/file-upload/file-upload.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AboutUsComponent } from './common/about-us/about-us.component';
import { LoginComponent } from './common/auth/login/login.component';
import { SignupComponent } from '../app/common/auth/signup/signup.component'
import { ErrorComponent } from './common/error/error.component';
import { SfFileUploadComponent } from './common/upload/sf-file-upload/sf-file-upload.component';
import { ResUploadComponent } from './users/res-upload/res-upload.component';
import { SafePipe } from './common/pipes/safe.pipe';


import { AuthInterseptor } from './common/auth/auth-interseptor';
import { ErrorInterceptor } from './error-interceptor';
import { ProfileComponent } from './users/profile/profile.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { ViewResultsComponent } from './users/view-results/view-results.component';
import { MyLocationComponent } from './common/my-location/my-location.component';
import { AgmCoreModule } from '@agm/core';
import { TimeTableComponent } from './common/time-table/time-table.component';



@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    HeaderComponent,
    ViewPostsComponent,
    FileUploadComponent,
    EditPostComponent,
    NotFoundComponent,
    AboutUsComponent,
    LoginComponent,
    SignupComponent,
    SfFileUploadComponent,
    ResUploadComponent,
    SafePipe,
    ProfileComponent,
    ResetPasswordComponent,
    ViewResultsComponent,
    MyLocationComponent,
    TimeTableComponent,



  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RoutingModule,
    RouterModule,

    AngularMaterialModule,  //angular-material module
    UploaderModule, //syncfusion-angular-uploader

    AgmCoreModule.forRoot({
      apiKey: environment.mApiKey
    })

  ],
  //multi TRUE says not to override, just add additional
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterseptor, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
