var lyftTokenHelper = require('../helperFunctions/lyftTokenHelper.js');
var axios = require('axios');

module.exports = {
  lyftToken: {
    get: function(callback, params) {
      console.log('inside users get apiLyft.js Models');
      lyftTokenHelper.getToken(callback);
    },
    post: function(callback, params) {},
    put: function(callback) {},
    delete: function(callback) {}
  },
  lyftPrice: {
    get: function(callback, params) {
      console.log('inside users get apiLyft.js Models');
      const getPrice = token => {
        var url = `https://api.lyft.com/v1/cost?start_lat=${params.start_latitude}&start_lng=${params.start_longitude}&end_lat=${params.end_latitude}&end_lng=${params.end_longitude}`;
        axios({
          method: 'get',
          url,
          headers: {
            authorization: token,
          }
        })
          .then(({data}) => callback(data))
          .catch(err => console.log(err))
      }
      lyftTokenHelper.getToken(getPrice);
    },
    post: function(callback, params) {},
  }
}
