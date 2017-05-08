import { Directive,  Input, Output } from '@angular/core';
import { GoogleMapsAPIWrapper }  from '@agm/core';
 
declare var google: any;
declare var RouteBoxer: any;

@Directive({
  selector: 'sebm-google-map-directions'
})
export class DirectionsMapDirective {
  @Input() origin: any ;
  @Input() destination: any;
  @Input() originPlaceId: any;
  @Input() destinationPlaceId: any;
  @Input() waypoints: any;
  @Input() directionsDisplay: any;
  @Input() estimatedTime: any;
  @Input() estimatedDistance: any;
 
  constructor (
    private gmapsApi: GoogleMapsAPIWrapper
  ) {}

  updateDirections() {
    this.gmapsApi.getNativeMap()
      .then(map => {
        if(!this.originPlaceId || !this.destinationPlaceId ){
          return;
        }

        var directionsService = new google.maps.DirectionsService;
        var me = this;
        var latLngA = new google.maps.LatLng({lat: this.origin.latitude, lng: this.origin.longitude });
        var latLngB = new google.maps.LatLng({lat: this.destination.latitude, lng: this.destination.longitude });
        this.directionsDisplay.setMap(map);
        this.directionsDisplay.setOptions({
            polylineOptions: {
                strokeWeight: 8,
                strokeOpacity: 0.7,
                strokeColor:  '#00468c' 
            }
        });

        this.directionsDisplay.setDirections({routes: []});
        directionsService.route({
            origin: {placeId : this.originPlaceId },
            destination: {placeId : this.destinationPlaceId },
            avoidHighways: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(response: any, status: any) {
            if (status === 'OK') {
                me.directionsDisplay.setDirections(response);
                map.setZoom(30);
                var point = response.routes[ 0 ].legs[ 0 ];
                me.estimatedTime = point.duration.text ;
                me.estimatedDistance = point.distance.text;
                console.log(me.estimatedTime);
                console.log( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );

                this.routeBoxer = new RouteBoxer();
                // clearBoxes();
                // clearMarkers();

                // var path = result.routes[0].overview_path;
                // var boxes = routeBoxer.box(path, distance);

                // drawBoxes(boxes);
                // findMarkers(boxes);
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
    });
  }

  // private clearBoxes() {
  //   if (boxpolys != null) {
  //     for (var i = 0; i < boxpolys.length; i++) {
  //       boxpolys[i].setMap(null);
  //     }
  //   }
  //   boxpolys = null;
  // }

  // private clearMarkers() {
  //   for (var i=0; i < foundLocationMarkers.length; i++) {
  //     foundLocationMarkers[i].setMap(null);
  //     foundLocationMarkers.pop(foundLocationMarkers[i]);
  //   }
  // }

}