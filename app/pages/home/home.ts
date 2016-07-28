import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  map: any;
  mapInitialised: any = false;
  apiKey: any;
  constructor(private nav: NavController, private connectivityService: ConnectivityService) {
    // this.map = null;
  }

  ngOnInit() {
    // this.loadMap();
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {

    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");

        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);

      }
    }
    else {

      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }

    }

  }

  initMap() {

    this.mapInitialised = true;

    navigator.geolocation.getCurrentPosition((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }, (error) => {
      console.log(error);
    });

  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {
    var me = this;

    var onOnline = () => {
      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        } else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);
    };

    var onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  /* Basic map with hard-coded coordinates
  loadMap() {
    var latLng = new google.maps.LatLng(41.8781, -87.6298);//Coordinates for Chicago
    var mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    new google.maps.Map(document.getElementById("map"), mapOptions);
  }
  */

  // Geolocation plugin
  /*loadMap() {

    let options = { timeout: 10000, enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(

      (position) => {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      },
      (error) => {
        console.log(error);
      },
      options);
  }*/

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = marker.getPosition().toString();

    this.addInfoWindow(marker, content);

  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(this.map, marker);
    });

  }
}
