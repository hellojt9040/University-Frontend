import { UserService } from './../../../users/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sf-file-upload',
  template: `
  <div id='droparea'>
    Drop .xlsx files here to upload
  </div>
  <div id='uploadfile' >
    <ejs-uploader #defaultupload [autoUpload]='false' [dropArea]='dropEle' [asyncSettings]='path' allowedExtensions = '.xlsx' (success)="onUploadSuccess($event)" (failure)="onUploadFailure($event)"></ejs-uploader>
  </div>
 `,
})
export class SfFileUploadComponent implements OnInit {
  public dropEle: HTMLElement

  fileToUpload

  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove' };
    public onUploadSuccess(args: any){
      if (args.operation === 'upload') {
          console.log('File uploaded successfully')
          this.fileToUpload = args.file
          this.userService.uploadNewResultData(this.fileToUpload)
      }
  }

  public onUploadFailure(args: any): void  {
  console.log('File failed to upload');
  }


  ngOnInit() {
    this.dropEle = document.getElementById('droparea')

  }

  constructor(private userService:UserService) {
  }
}
