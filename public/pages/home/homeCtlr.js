angular.module('App')
  .controller('HomeController', function($location, $scope, $state, $localStorage, $interval, homeFactory) {
    var vm = this;
    vm.user = {};

    vm.saveUserLoc = function(){
      vm.user.curLat = vm.user.curLoc.geometry.location.lat();
      vm.user.curLng = vm.user.curLoc.geometry.location.lng();
      vm.user.endLat = vm.user.endLoc.geometry.location.lat();
      vm.user.endLng = vm.user.endLoc.geometry.location.lng();
    }

    vm.reset = function(){
      vm.user = {};
    }
  });
