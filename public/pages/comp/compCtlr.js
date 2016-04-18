angular.module('App')
  .controller('CompController', function($scope, $state, compFactory, graphFactory) {
    var vm = this;
    graphFactory.chartOptionsStorageInit();
    vm.chartOptionsStorage = graphFactory.chartOptionsStorage
    compFactory.loadSpinner.showSpinner = true;

    vm.loadSpinner = compFactory.loadSpinner;
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
                  angular.forEach(data.cost_estimates, function(value) {
                    value.estimate = '$' + (value.estimated_cost_cents_min / 100) + '-' + (value.estimated_cost_cents_max / 100);
                    vm.chartOptionsStorage.all.rideType.push(value.display_name);
                    if (value.ride_type === 'lyft_line') {
                      vm.chartOptionsStorage.all.price.lyftLinePrice.push([(value.estimated_cost_cents_min / 100), null]);
                      vm.chartOptionsStorage.all.price.lyftLinePrice.unshift([null, null]);
                    } else {
                      vm.chartOptionsStorage.all.price.lyftPrice.push([(value.estimated_cost_cents_min / 100), (value.estimated_cost_cents_max / 100)])
                      if (value.ride_type === 'lyft_plus') {
                        vm.chartOptionsStorage.all.price.lyftPrice.push([null, null]);
                      }
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
                      vm.rideDataLoaded = true;
                    })
                });
            });
        });
    }

    vm.home = function() {
      $state.go('home');
    }

    vm.init();
  });
