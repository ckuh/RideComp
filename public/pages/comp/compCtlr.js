angular.module('App')
  .controller('CompController', function($location, $scope, $state, $localStorage, $interval, $timeout, compFactory, uiGmapIsReady, highchartsNG) {
    var vm = this;
    vm.taxiPrice = {};
    vm.uberPrice = {};
    vm.lyftPrice = [];
    vm.lyftToken = {};
    vm.dataLoaded = false;
    vm.showSpinner = true;
    vm.chartOptions = {};
    vm.chartOptionsStorage = {};

    vm.init = function() {
      vm.chartOptionsStorage.all = {
        rideType: ['Taxi'],
        price: {
          taxiPrice: [],
          uberPrice: [],
          lyftPrice: [
            [null, null]
          ],
          lyftLinePrice: [
            [null, null]
          ]
        },
        series: []
      }
      vm.chartOptionsStorage.small = {
        categories: ['Taxi'],
        taxi: {
          series: {
            data: [],
            name: 'taxi',
            color: '#F7B731'
          }
        },
        lyft: {
          series: {
            data: [
              [null, null]
            ],
            name: 'lyft',
            color: '#FF00BF'
          }
        },
        uber: {
          series: {
            data: [
              [null, null],
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
                  angular.forEach(data.cost_estimates, function(value) {
                    value.estimate = '$' + (value.estimated_cost_cents_min / 100) + '-' + (value.estimated_cost_cents_max / 100);
                    vm.chartOptionsStorage.all.rideType.push(value.display_name);
                    if (value.ride_type === 'lyft_line') {
                      vm.chartOptionsStorage.all.price.lyftLinePrice.push([(value.estimated_cost_cents_min / 100), null]);
                      vm.chartOptionsStorage.all.price.lyftPrice.unshift([null, null]);
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
                    if (value.display_name !== 'CHOPPER' && value.display_name !== 'uberT' && value.display_name !== 'Yellow WAV' && value.display_name !== 'WAV') {
                      vm.chartOptionsStorage.all.rideType.push(value.display_name);
                      vm.chartOptionsStorage.all.price.uberPrice.push([value.low_estimate, value.high_estimate]);
                    }
                    if (value.display_name === 'uberX') {
                      vm.chartOptionsStorage.small.categories.push(value.display_name);
                      vm.chartOptionsStorage.small.uber.series.data.push([value.low_estimate, value.high_estimate]);
                    }
                  });

                  vm.lyftPrice = data.cost_estimates;
                  // console.log('getLyftPrice: ', vm.lyftPrice);

                  compFactory.getTaxiPrice()
                    .then(function(data) {
                      // console.log('getTaxiPrice: ', [data]);
                      var smallNum = (data.total_fare - data.tip_amount).toFixed(2);

                      vm.chartOptionsStorage.all.price.taxiPrice.push([parseFloat(smallNum), data.total_fare]);
                      vm.chartOptionsStorage.small.taxi.series.data.push([parseFloat(smallNum), data.total_fare])
                      vm.setGraph();
                    })
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
            inverted: true,
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
                },
                style: {
                  fontWeight: 'bold'
                }
              }
            },
          }
        },
        xAxis: {
          categories: vm.chartOptionsStorage.all.rideType,
          tickColor: 'rgba(0,0,0,0)'
        },
        yAxis: {
          title: {
            text: 'Price ($)'
          },
          gridLineColor: 'rgba(0,0,0,0)',
          visible: false
        },
        credits: {
          enabled: true,
          text: 'uber.com/lyft.com/taxifarefinder.com'
        },
        series: [{
          name: 'taxi',
          data: vm.chartOptionsStorage.all.price.taxiPrice,
          color: '#F7B731'
        }, {
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
      vm.lyftUberX();
      vm.dataLoaded = true;
      vm.showSpinner = false;
    }

    vm.home = function() {
      $state.go('home');
    }

    vm.lyftUberX = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.small.categories;
      vm.chartOptions.series = [vm.chartOptionsStorage.small.taxi.series, vm.chartOptionsStorage.small.lyft.series, vm.chartOptionsStorage.small.uber.series];
    }

    vm.allGraph = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.all.rideType;
      vm.chartOptions.series = vm.chartOptionsStorage.all.series;
    }

    vm.init();
  });
