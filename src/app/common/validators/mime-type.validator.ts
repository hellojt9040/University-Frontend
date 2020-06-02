import { FormControl } from '@angular/forms'
import { Observable, Observer } from 'rxjs'

export const mimeType =
  (control: FormControl) : Promise<{[key:string] : any}> | Observable<{[key:string] : any}> => {

    const file:File = control.value as File
    const fileReader = new FileReader()
    let header = ""
    let isValid = false

    const frObs = Observable.create((observer: Observer<{[key:string] : any}>) => {
      fileReader.addEventListener('loadend', () => {
        const arr8Data = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4)
        for(let arr of arr8Data){
          header += arr.toString(16)
        }

        switch (header) {
          case "89504e47":    //png
            isValid = true
            break;
          case "47494638":
          case "ffd8ffe0":
            isValid = true
            break;
          case "ffd8ffe1":
            isValid = true
            break;
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":    //jpeg
            isValid = true
            break;
          default:
            isValid = false // Or you can use the blob.type as fallback
            break;
        }
        if(isValid){
          observer.next(null)   // every thing is fine
        }else {
          observer.next({ invalidMimeType:true })   // things went haywire
        }
        observer.complete()
      })
      fileReader.readAsArrayBuffer(file)
    })

    return frObs
}
