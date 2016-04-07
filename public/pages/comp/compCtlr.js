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
    vm.chartOptionsStorage = {};
    vm.map = {
      center: {
        latitude: ($localStorage.user.curLat + $localStorage.user.endLat) / 2,
        longitude: ($localStorage.user.curLng + $localStorage.user.endLng) / 2
      },
      zoom: 13,
      refresh: true
    };
    vm.options = {
      draggable: false,
      mapTypeControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      streetViewControl: false,
      zoomControl: false
    };
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
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    });

    vm.init = function() {
      vm.chartOptionsStorage.all = {
        rideType: [],
        price: {
          uberPrice: [],
          lyftPrice: [],
          lyftLinePrice: []
        },
        series: []
      }
      vm.chartOptionsStorage.small = {
        categories: [],
        lyft: {
          series: {
            data: [],
            name: 'lyft',
            color: '#FF00BF'
          }
        },
        uber: {
          series: {
            data: [
              [null, null]
            ],
            name: 'uber',
            color: '#161629'
          }
        }
      }
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
                  angular.forEach(data.cost_estimates, function(value) {
                    value.estimate = '$' + (value.estimated_cost_cents_min / 100) + '-' + (value.estimated_cost_cents_max / 100);
                    vm.chartOptionsStorage.all.rideType.push(value.display_name);
                    if (value.ride_type === 'lyft_line') {
                      vm.chartOptionsStorage.all.price.lyftLinePrice.push([(value.estimated_cost_cents_min / 100), null]);
                      vm.chartOptionsStorage.all.price.lyftPrice.push([null, null]);
                    } else {
                      vm.chartOptionsStorage.all.price.lyftPrice.push([(value.estimated_cost_cents_min / 100), (value.estimated_cost_cents_max / 100)])
                    }
                    if (value.ride_type === 'lyft') {
                      vm.chartOptionsStorage.small.categories.push(value.display_name)
                      vm.chartOptionsStorage.small.lyft.series.data.push([(value.estimated_cost_cents_min / 100), (value.estimated_cost_cents_max / 100)])
                    }
                  });

                  angular.forEach(vm.chartOptionsStorage.all.price.lyftPrice, function(value) {
                    vm.chartOptionsStorage.all.price.uberPrice.unshift([null, null]);
                  })

                  angular.forEach(vm.uberPrice, function(value) {
                    vm.chartOptionsStorage.all.rideType.push(value.display_name);
                    vm.chartOptionsStorage.all.price.uberPrice.push([value.low_estimate, value.high_estimate]);
                    if (value.display_name === 'uberX') {
                      vm.chartOptionsStorage.small.categories.push(value.display_name);
                      vm.chartOptionsStorage.small.uber.series.data.push([value.low_estimate, value.high_estimate]);
                    }
                  });


                  vm.lyftPrice = data.cost_estimates;
                  // console.log('getLyftPrice: ', vm.lyftPrice);

                  vm.setGraph();
                });
            });
        });
    }

    vm.setGraph = function() {
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
          categories: vm.chartOptionsStorage.all.rideType,
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
          data: vm.chartOptionsStorage.all.price.lyftLinePrice,
          color: 'rgba(0,0,0,0)'
        }, {
          name: 'lyft',
          data: vm.chartOptionsStorage.all.price.lyftPrice,
          color: '#FF00BF'
        }, {
          name: 'uber',
          data: vm.chartOptionsStorage.all.price.uberPrice,
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
      vm.chartOptionsStorage.all.series = vm.chartOptions.series;
      vm.dataLoaded = true;
      vm.showSpinner = false;
    }

    vm.home = function() {
      $state.go('home');
    }

    vm.lyftUberX = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.small.categories;
      vm.chartOptions.series = [vm.chartOptionsStorage.small.lyft.series, vm.chartOptionsStorage.small.uber.series];
    }

    vm.allGraph = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.all.rideType;
      vm.chartOptions.series = vm.chartOptionsStorage.all.series;
    }
    vm.init();
  });
