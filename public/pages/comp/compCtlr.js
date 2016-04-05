angular.module('App')
  .controller('CompController', function($location, $scope, $state, $localStorage, $interval, compFactory) {
    var vm = this;
    vm.uberPrice = {};
    vm.lyftToken = {};

    vm.init = function(){
      compFactory.getLyftToken()
      .then(function(data){
        vm.lyftToken = data;

        compFactory.getLyftPrice(vm.lyftToken)
        .then(function(data){
          console.log(data);
        });

      });
    }


    compFactory.getUberPrice()
    .then(function(data){
      console.log(data);
      vm.uberPrice = data.prices;
    });

    vm.init();
  });
