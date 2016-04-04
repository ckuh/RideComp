angular.module('compFactory', [])
  .factory('compFactory', function($state, $localStorage, $http) {
    var service = {
      getLyftPrice: getLyftPrice,
      getLyftToken: getLyftToken,
      getUberPrice: getUberPrice
    }
    return service;

    function getLyftPrice() {
      var lyftUrl = 'https://api.lyft.com/v1/';
      return $http.get('https://api.lyft.com/v1/ridetypes?lat=37.7833&lng=-122.4167')
        .then(getLyftPriceComplete)
        .catch(getLyftPriceFailed);

      function getLyftPriceComplete(response) {
        return response.data.results;
      }

      function getLyftPriceFailed(error) {
        console.error('XHR Failed for getLyftPrice.' + error.status);
      }
    }

    // curl -X POST -H "Content-Type: application/json" \
    //      --user "<client_id>:<client_secret>" \
    //      -d '{"grant_type": "client_credentials", "scope": "public"}' \
    //      'https://api.lyft.com/oauth/token'

    function getLyftToken() {
      var req = {
        method: 'POST',
        url: 'https://api.lyft.com/oauth/token',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          client_id: 'IeoElebZ35AY',
          client_secret: 'uX-gqMuGRfK5xqpdOUvE-mjVheM1C85N',
          grant_type: 'client_credentials',
          scope: 'public',
          redirect_uri: 'http://localhost:3000/callback'
        }
      }
      return $http(req)
        .then(getLyftTokenComplete)
        .catch(getLyftTokenFailed);

      function getLyftTokenComplete(response) {
        return response.data.results;
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
