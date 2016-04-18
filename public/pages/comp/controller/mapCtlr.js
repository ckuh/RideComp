angular.module('App')
  .controller('MapController', function($scope, $localStorage, uiGmapIsReady) {
    var vm = this;
    vm.control = {};
    vm.map = {
      center: {
        latitude: ($localStorage.user.curLat + $localStorage.user.endLat) / 2,
        longitude: ($localStorage.user.curLng + $localStorage.user.endLng) / 2
      },
      zoom: 13,
      refresh: true,
      resetMap: {}
    };
    vm.options = {
      draggable: false,
      mapTypeControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      streetViewControl: false,
      zoomControl: false
    };

    vm.init = function() {
      vm.setMap();
    }

    vm.setMap = function() {
      vm.dataLoaded = true;
      vm.showSpinner = false;
      uiGmapIsReady.promise().then(function() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var displayedMap = vm.control.getGMap();
        directionsDisplay.setMap(displayedMap);
        var options = {
          origin: {
            lat: $localStorage.user.curLat,
            lng: $localStorage.user.curLng
          },
          destination: {
            lat: $localStorage.user.endLat,
            lng: $localStorage.user.endLng
          },
          travelMode: google.maps.TravelMode.DRIVING,
          avoidTolls: true
        }

        directionsService.route(options, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            google.maps.event.addDomListener(window, 'resize', function() {
              directionsDisplay.setDirections(response);
            });
            google.maps.event.addListener(vm.control.getGMap(), 'resize', function() {
              directionsDisplay.setDirections(response);
            });
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      });
    }

    vm.resetMap = function() {
      google.maps.event.trigger(vm.control.getGMap(), "resize");
    }

    vm.init();
  });
