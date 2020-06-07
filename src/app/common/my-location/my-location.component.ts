import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-location',
  templateUrl: './my-location.component.html',
  styleUrls: ['./my-location.component.css']
})
export class MyLocationComponent implements OnInit {
  lat:any;
  lng:any;
  myCurrentLocation
  constructor(){
    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
        this.lng = pos.coords.longitude;
        this.lat = pos.coords.latitude;
        this.setMyLocation(this.lng,this.lat)

      });
    }
  }

  setMyLocation(lng,lat){
    const url = 'https://www.google.com/maps/place/'
    this.myCurrentLocation = url + lat.toString() + ',' + lng.toString()
  }

  ngOnInit(): void {}
}
