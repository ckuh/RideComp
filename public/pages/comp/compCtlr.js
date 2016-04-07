angular.module('App')
  .controller('CompController', function($location, $scope, $state, $localStorage, $interval, $timeout, compFactory, uiGmapIsReady, highchartsNG) {
    var vm = this;
    vm.uberPrice = {};
    vm.lyftPrice = [];
    vm.lyftToken = {};
    vm.dataLoaded = false;
    vm.showSpinner = true;
    vm.control = {};
    vm.chartOptions = {};
    vm.map = {
      center: {
        latitude: ($localStorage.user.curLat + $localStorage.user.endLat) / 2,
        longitude: ($localStorage.user.curLng + $localStorage.user.endLng) / 2
      },
      zoom: 13,
      refresh: true
    };
    vm.options = {
      scrollwheel: false,
      disableDoubleClickZoom: true,
      streetViewControl: false,
      zoomControl: false
    };
    uiGmapIsReady.promise().then(function() {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
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
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    });

    vm.init = function() {
      compFactory.getUberPrice()
        .then(function(data) {
          // console.log('getUberPrice: ', data.prices);
          vm.uberPrice = data.prices;

          compFactory.getLyftToken()
            .then(function(data) {
              vm.lyftToken = data;

              compFactory.getLyftPrice(vm.lyftToken)
                .then(function(data) {
                  var rideType = [];
                  var price = {
                    uberPrice: [],
                    lyftPrice: [],
                    lyftLinePrice: []
                  }

                  angular.forEach(data.cost_estimates, function(value) {
                    value.estimate = '$' + (value.estimated_cost_cents_min / 100) + '-' + (value.estimated_cost_cents_max / 100);
                    rideType.push(value.display_name);
                    if (value.ride_type === 'lyft_line') {
                      price.lyftLinePrice.push([(value.estimated_cost_cents_min / 100), null]);
                      price.lyftPrice.push([null, null]);
                    } else {
                      price.lyftPrice.push([(value.estimated_cost_cents_min / 100), (value.estimated_cost_cents_max / 100)])
                    }
                  });

                  angular.forEach(price.lyftPrice, function(value) {
                    price.uberPrice.unshift([null, null]);
                  })

                  angular.forEach(vm.uberPrice, function(value) {
                    rideType.push(value.display_name);
                    price.uberPrice.push([value.low_estimate, value.high_estimate]);
                  });


                  vm.lyftPrice = data.cost_estimates;
                  // console.log('getLyftPrice: ', vm.lyftPrice);

                  vm.setGraph(rideType, price);
                });
            });
        });
    }

    vm.setGraph = function(rideType, price) {
      vm.chartOptions = {
        options: {
          legend: {
            enabled: false
          },
          chart: {
            type: 'columnrange',
            inverted: true
          },
          tooltip: {
            formatter: function() {
              return '<b>' + this.x + '</b> available for $<b>' + this.point.low + '</b>-<b>' + this.point.high + '</b>';
            }
          },
          plotOptions: {
            columnrange: {
              dataLabels: {
                enabled: true,
                formatter: function() {
                  return '$' + this.y;
                }
              }
            }
          }
        },
        xAxis: {
          categories: rideType,
          title: {
            text: 'Ride Type'
          }
        },
        yAxis: {
          title: {
            text: 'Price ($)'
          }
        },
        credits: {
          enabled: true,
          text: 'uber.com/lyft.com'
        },
        series: [{
          name: 'lyft',
          data: price.lyftLinePrice,
          color: 'rgba(0,0,0,0)'
        }, {
          name: 'lyft',
          data: price.lyftPrice,
          color: '#FF00BF'
        }, {
          name: 'uber',
          data: price.uberPrice,
          color: '#161629'
        }],
        title: {
          text: 'Ride Price Estimates'
        },
        func: function(chart) {
          $timeout(function() {
            chart.reflow();
          }, 0);
        }
      };
      vm.dataLoaded = true;
      vm.showSpinner = false;
    }

    vm.home = function() {
      $state.go('home');
    }

    vm.init();
  });
