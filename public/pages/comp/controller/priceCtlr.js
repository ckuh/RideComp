angular.module('App')
  .controller('PriceController', function($scope, $state, compFactory) {
    var vm = this;
    vm.allRideData = compFactory.allRideData;
    vm.rideDisplay = [];

    vm.init = function() {
      angular.forEach(vm.allRideData, function(rideType, key) {
        angular.forEach(rideType, function(value) {
          // console.log(rideType);
          if (key === 'lyft') {
            if (value.estimated_cost_cents_min !== 0) {
              vm.rideDisplay.push({
                key: key,
                name: value.display_name,
                avgCost: ((value.estimated_cost_cents_max + value.estimated_cost_cents_min) / 200).toFixed(2)
              });
            }
          } else if (key === 'uber') {
            if (value.low_estimate !== null && value.low_estimate !== 0) {
              vm.rideDisplay.push({
                key: key,
                name: value.display_name,
                avgCost: ((value.high_estimate + value.low_estimate) / 2).toFixed(2)
              });
            }
          } else if (key === 'taxi') {
            vm.rideDisplay.push({
              key: key,
              name: 'Taxi',
              avgCost: ((value.total_fare + (value.total_fare - value.tip_amount)) / 2).toFixed(2)
            });
          }
        });
      });
      vm.rideDisplay.sort(function(a, b) {
        return a.avgCost - b.avgCost;
      })
    }

    vm.init();
    // console.log('then me price controller ', vm.rideDisplay);
  });
