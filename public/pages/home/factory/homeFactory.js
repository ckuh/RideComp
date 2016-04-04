angular.module('homeFactory', [])
  .factory('homeFactory', function($state, $localStorage, $http) {
    var service = {
      getCurLocString: getCurLocString
    }
    return service;

    function getCurLocString(lat,lng){
      var key = 'AIzaSyCCbjiBoKsG7rC0VPJ5cR0rkjJNrx1wtpA';
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+key;
      return $http.get(url)
           .then(getCurLocStringComplete)
           .catch(getCurLocStringFailed);

       function getCurLocStringComplete(response) {
           return response.data.results;
       }

       function getCurLocStringFailed(error) {
           console.error('XHR Failed for getCurLocString.' + error.data);
       }
    }
  })
