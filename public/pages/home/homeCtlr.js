angular.module('App')
  .controller('HomeController', function($location, $scope, $state, $localStorage, $interval, homeFactory) {
    var vm = this;
    vm.user = {};
    $localStorage.user = {};

    vm.saveUserLoc = function(){
      $localStorage.user.curLat = vm.user.curLoc.geometry.location.lat();
      $localStorage.user.curLng = vm.user.curLoc.geometry.location.lng();
      $localStorage.user.endLat = vm.user.endLoc.geometry.location.lat();
      $localStorage.user.endLng = vm.user.endLoc.geometry.location.lng();
      $state.go('comp');
    }

    vm.reset = function(){
      vm.user = {};
    }
  });
