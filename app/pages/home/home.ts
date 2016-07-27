import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  map: any;
  constructor(private navCtrl: NavController) {
    this.map = null;
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    var latLng = new google.maps.LatLng(41.8781, -87.6298);//Coordinates for Chicago
    var mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    new google.maps.Map(document.getElementById("map"), mapOptions);
  }
}
