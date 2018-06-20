angular.module('compFactory', [])
  .factory('compFactory', function($state, $localStorage, $http) {
    var loadSpinner = {};
    var allRideData = {};
    var service = {
      getLyftPrice: getLyftPrice,
      getLyftToken: getLyftToken,
      getUberPrice: getUberPrice,
      getTaxiPrice: getTaxiPrice,
      loadSpinner: loadSpinner,
      setAllRideData: setAllRideData,
      allRideData: allRideData,
    }
    return service;

    function setAllRideData(rideData) {
      this.allRideData = rideData;
    }

    function getLyftPrice(token) {
      var auth = token.token_type + ' ' + token.access_token;

      var req = {
        method: 'GET',
        url: '/api/lyftPrice',
        params: {
          start_latitude: $localStorage.user.curLat,
          start_longitude: $localStorage.user.curLng,
          end_latitude: $localStorage.user.endLat,
          end_longitude: $localStorage.user.endLng
        }
      }

      return $http(req)
        .then(getLyftPriceComplete)
        .catch(getLyftPriceFailed);

      function getLyftPriceComplete(response) {
        console.log(response)
        return response.data;
      }

      function getLyftPriceFailed(error) {
        console.error('XHR Failed for getLyftPrice.' + error);
      }
    }

    function getLyftToken() {
      var req = {
        method: 'GET',
        url: '/api/lyftToken',
      }
      return $http(req)
        .then(getLyftTokenComplete)
        .catch(getLyftTokenFailed);

      function getLyftTokenComplete(response) {
        return response.data.token;
      }

      function getLyftTokenFailed(error) {
        console.error('XHR Failed for getLyftPrice.' + error.data.error);
      }
    }

    function getUberPrice() {
      var req = {
        method: 'POST',
        url: '/api/uberPrice',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          start_latitude: $localStorage.user.curLat,
          start_longitude: $localStorage.user.curLng,
          end_latitude: $localStorage.user.endLat,
          end_longitude: $localStorage.user.endLng
        }
      }
      return $http(req)
        .then(getUberPriceComplete)
        .catch(getUberPriceFailed);

      function getUberPriceComplete(response) {
        return response.data;
      }

      function getUberPriceFailed(error) {
        console.error('XHR Failed for getLyftPrice.' + error.data.error);
      }
    }

    function getTaxiPrice() {
      var paths = {
        entityHandle: '',
        origin: {
          lat: $localStorage.user.curLat + ',',
          lng: $localStorage.user.curLng
        },
        dest: {
          lat: $localStorage.user.endLat + ',',
          lng: $localStorage.user.endLng
        }
      }
      var taxiUrl = {
        url: paths.origin.lat + paths.origin.lng + '&destination=' + paths.dest.lat + paths.dest.lng
      }

      var req = {
        method: 'POST',
        url: '/api/taxiPrice',
        data: taxiUrl
      }
      return $http(req)
        .then(getTaxiPriceComplete)
        .catch(getTaxiPriceFailed);

      function getTaxiPriceComplete(response) {
        return response.data;
      }

      function getTaxiPriceFailed(error) {
        console.error('XHR Failed for getTaxiPrice: ' + error[0]);
      }
    }
  })
