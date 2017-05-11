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
  private currentRoute: any;
  private foundLocationMarkers: google.maps.Marker[];
  private boxpolys: google.maps.Rectangle[];
  private map: any;

  constructor (
    private gmapsApi: GoogleMapsAPIWrapper
  ) {}

  updateRoute() {
    this.gmapsApi.getNativeMap()
      .then(map => {
        if(!this.originPlaceId || !this.destinationPlaceId ){
          return;
        }

        this.map = map;
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
                me.currentRoute = response.routes[0];
                me.directionsDisplay.setDirections(response);
                map.setZoom(30);
                var point = response.routes[ 0 ].legs[ 0 ];
                console.log( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
    });
  }

  findCrags(dist: number) {
    var routeBoxer = new RouteBoxer();
    this.clearBoxes();
    this.clearMarkers();

    // Convert the distance to box around the route from miles to km
    var distance = dist * 1.609344;

    if(this.currentRoute != null) {
      console.log("route: ");
      console.log(this.currentRoute);
      var path = this.currentRoute.overview_path;
      console.log("path: " + path);
      console.log("distance: " + distance);
      var boxes = routeBoxer.box(path, distance);

      this.drawBoxes(boxes);
      this.findMarkers(boxes);
    }
  }

  private clearBoxes() {
    if (this.boxpolys != null) {
      for (var i = 0; i < this.boxpolys.length; i++) {
        this.boxpolys[i].setMap(null);
      }
    }
    this.boxpolys = null;
  }

  private clearMarkers() {
    if (this.foundLocationMarkers != null) {
      for (var i = this.foundLocationMarkers.length - 1; i >= 0; i--) {
        this.foundLocationMarkers[i].setMap(null);
        this.foundLocationMarkers.pop();
      }
    }
  }

  // Draw the array of boxes as polylines on the map
  private drawBoxes(boxes: any) {
    console.log("drawing boxes");
    this.boxpolys = new Array(boxes.length);
    for (var i = 0; i < boxes.length; i++) {
      this.boxpolys[i] = new google.maps.Rectangle(
                            { bounds: boxes[i],
                              fillOpacity: 0,
                              strokeOpacity: 1.0,
                              strokeColor: '#000000',
                              strokeWeight: 1,
                              map: this.map
                            } );
    } 
  }

  private findMarkers(boxes: any) {
    // var db_locations = null;

    // Making this synchronous for now as db_locations
    // is used immediately after this call. Can alternatively
    // block until success callback, but seems the same?
    // $.ajax({
    //     url: "/lib/db/data.php",
    //     dataType: 'json',
    //     async: false,
    //     success: function(data) {
    //         db_locations = data;
    //     }
    // });

    // var db_locations = <?php echo json_encode($locations); ?>;

    // for (var i=0; i < boxes.length; i++) {

    //     for (var n=0; n < db_locations.length; n++) {

    //         var temp_loc = new google.maps.LatLng(db_locations[n][1], db_locations[n][2]);
    //         if (boxes[i].contains(temp_loc)) {

    //             var temp_title;
    //             if(db_locations[n][3] == 0) {
    //                 temp_title = "(Unverified): " + db_locations[n][0];
    //             } else {
    //                 temp_title = db_locations[n][0];
    //             }

    //             var marker = new google.maps.Marker({
    //                 position: temp_loc,
    //                 map: map,
    //                 title: temp_title
    //             });

    //             if(db_locations[n][3] == 0) {
    //                 marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    //             }

    //             foundLocationMarkers.push(marker);
    //         }
    //     }
    // }
  }

}