angular.module('App')
  .controller('HomeController', function($location, $scope, $state, $localStorage, $interval, homeFactory, geolocation) {
    var vm = this;
    vm.user = {};
    vm.spinner = false;
    $localStorage.user = {};
    $state.get('comp').authenticate = true;

    vm.saveUserLoc = function() {
      if (vm.user.curLoc.geometry) {
        $localStorage.user.curLat = vm.user.curLoc.geometry.location.lat();
        $localStorage.user.curLng = vm.user.curLoc.geometry.location.lng();
      } else {
        $localStorage.user.curLat = vm.autoLat;
        $localStorage.user.curLng = vm.autoLng;
      }

      if (vm.user.endLoc.geometry) {
        $localStorage.user.endLat = vm.user.endLoc.geometry.location.lat();
        $localStorage.user.endLng = vm.user.endLoc.geometry.location.lng();
      } else {
        $localStorage.user.endLat = vm.autoLat;
        $localStorage.user.endLng = vm.autoLng;
      }
      $state.go('comp');
    }

    vm.swap = function() {
      var hold = vm.user.curLoc;
      vm.user.curLoc = vm.user.endLoc;
      vm.user.endLoc = hold;
    }

    vm.getCurLoc = function() {
      vm.spinner = true;
      vm.user.curLoc = {};
      geolocation.getLocation()
        .then(function(data) {
          vm.autoLat = data.coords.latitude;
          vm.autoLng = data.coords.longitude;
          vm.spinner = false;

          homeFactory.getCurLocString(data.coords.latitude, data.coords.longitude)
            .then(function(data) {
              vm.user.curLoc = data[0].formatted_address;
            })
        });
    }

    vm.reset = function() {
      vm.user = {};
    }

    vm.getCurLoc();
  });
