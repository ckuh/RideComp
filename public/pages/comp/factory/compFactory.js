angular.module('compFactory', [])
  .factory('compFactory', function($state, $localStorage, $http) {
    var service = {
      getLyftPrice: getLyftPrice,
      getLyftToken: getLyftToken,
      getUberPrice: getUberPrice
    }
    return service;

    function getLyftPrice(token) {
      var auth = token.token_type + ' ' + token.access_token;
      var req = {
        method: 'GET',
        url: 'https://api.lyft.com/v1/ridetypes?lat=37.7833&lng=-122.4167',
        headers: {
          'Authorization': auth
        }
      }
      return $http(req)
        .then(getLyftPriceComplete)
        .catch(getLyftPriceFailed);

      function getLyftPriceComplete(response) {
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
        console.log(response)
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

  })
