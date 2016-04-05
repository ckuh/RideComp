angular.module('App')
  .controller('CompController', function($location, $scope, $state, $localStorage, $interval, compFactory) {
    var vm = this;
    vm.uberPrice = {};
    vm.lyftPrice = [];
    vm.lyftToken = {};

    vm.init = function(){
      compFactory.getLyftToken()
      .then(function(data){
        vm.lyftToken = data;

        compFactory.getLyftPrice(vm.lyftToken)
        .then(function(data){

          angular.forEach(data.cost_estimates, function(value) {
            value.estimate = '$' + (value.estimated_cost_cents_min/100) + '-' + (value.estimated_cost_cents_max/100);
          });

          vm.lyftPrice = data.cost_estimates;
          console.log('getLyftPrice: ', vm.lyftPrice);
        });

        compFactory.getUberPrice()
        .then(function(data){
          console.log('getUberPrice: ', data.prices);
          vm.uberPrice = data.prices;
        });

      });
    }



    vm.init();
  });
