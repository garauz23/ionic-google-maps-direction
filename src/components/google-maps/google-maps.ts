import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  HtmlInfoWindow,
  ILatLng,
  BaseArrayClass,
  Polyline,
  Encoding,
  LatLng
} from '@ionic-native/google-maps';
import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
@Component({
  selector: 'google-maps',
  templateUrl: 'google-maps.html'
})
export class GoogleMapsComponent {
  @ViewChild("map") mapElement;
  map: any;
  latitude: number;
  longitude: number;
  POINTS: BaseArrayClass<any> ;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public geolocation:Geolocation) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.POINTS = new BaseArrayClass<any>([
      {
        position: {lat: 9.00473,lng: -79.521922},
      },
    ]);
    
    this.geolocation.getCurrentPosition()
    .then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      localStorage.setItem('current_location',  this.latitude +","+ this.longitude);
      let latLng = new LatLng(this.latitude, this.longitude);
      let mapOptions: GoogleMapOptions = {
        camera: {
           target: latLng 
         },
         controls: {
          'compass': true,
          'myLocationButton': true,
          'myLocation': true,
          'indoorPicker': true,
          'zoom': true, 
          'mapToolbar': true
        },
        preferences: {
          zoom: {
            minZoom: 10,
            maxZoom: 18
          },
      
          padding: {
            left: 10,
            top: 10,
            bottom: 10,
            right: 10
          },
      
          building: true
        }
      };
  
      this.map = GoogleMaps.create('map', mapOptions);
  
  
  
      this.POINTS.forEach((data: any) => {
        data.disableAutoPan = true;

        let htmlInfoWindow = new HtmlInfoWindow();
  
        let frame: HTMLElement = document.createElement('div');
        frame.innerHTML = [
          `<h3>IR</h3>`
        ].join("");
        frame.getElementsByTagName("h3")[0].addEventListener("click", () => {

          let bounds: ILatLng[] = this.POINTS.map((data: any, idx: number) => {
            return data.position;
          });
  
  
  
          var _origin = new google.maps.LatLng(this.latitude, this.longitude);
          var _destination = new google.maps.LatLng(9.00473, -79.521922);
  

          let markerFin: Marker = this.map.addMarkerSync({
            icon: 'green',
            animation: 'DROP',
            position: {
              lat: 9.00473,
              lng: -79.521922
            }
          });
      
  
          this.displayDirection(this.directionsService, this.directionsDisplay, _origin , _destination);
          htmlInfoWindow.close();
        });
        htmlInfoWindow.setContent(frame, {
          width: "200px",
          height: "130px"
        });
    
        let marker: Marker = this.map.addMarkerSync({
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 9.00473,
            lng: -79.521922
          }
        });
    
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          htmlInfoWindow.open(marker);
        });
      });
      }).catch((error) => {

        console.log('Error getting location', error);
      }),
      { enableHighAccuracy: true, timeout: 10000, maximunAge: 3000};
  }

  displayDirection(directionsService, directionsDisplay, _origin, _dest) {
    directionsService.route({
     origin: _origin,
     destination: _dest,
     travelMode: 'DRIVING'
   }, (response, status) => {
     console.log("response", response);
     console.log("status", status);
     if (status === 'OK') {
      let _points_decoded: string = response.routes[0].overview_polyline;
      let _points: ILatLng[] = Encoding.decodePath(_points_decoded);
      console.log(_points);

      console.log(response.routes[0]);
       let polyline: Polyline = this.map.addPolylineSync({
        points: _points,
        color: '#AA00FF',
        width: 10,
        geodesic: true,
        clickable: false 
      });

     }
   });
}
  onMarkerClick(params: any) {

  }

  setLocation(){

    this.geolocation.getCurrentPosition()
    .then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

        localStorage.setItem('current_location',  this.latitude +","+ this.longitude);

      }).catch((error) => {

        console.log('Error getting location', error);
      }),
      { enableHighAccuracy: true, timeout: 10000, maximunAge: 3000};


  }

}
