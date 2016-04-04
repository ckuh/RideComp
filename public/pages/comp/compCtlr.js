angular.module('App')
  .controller('CompController', function($location, $scope, $state, $localStorage, $interval, compFactory) {
    var vm = this;

    // compFactory.getLyftToken();
    // compFactory.getLyftPrice();
    compFactory.getUberPrice()
    .then(function(data){
      console.log(data);
    });
  });
