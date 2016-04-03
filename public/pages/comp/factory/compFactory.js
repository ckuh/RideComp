angular.module('compFactory', [])
  .factory('compFactory', function($state, $localStorage, $http) {
    var service = {
      getLyftPrice: getLyftPrice,
      getLyftToken: getLyftToken
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
        debugger;
        return response.data.results;
      }

      function getLyftTokenFailed(error) {
        debugger;
        console.error('XHR Failed for getLyftPrice.' + error.data.error);
      }
    }

  })
