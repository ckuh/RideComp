var lyftTokenHelper = require('../helperFunctions/lyftTokenHelper.js');

module.exports = {
  lyftToken: {
    get: function(callback, params) {
      console.log('inside users get apiLyft.js Models');
      lyftTokenHelper.getToken(callback);
    },
    post: function(callback, params) {},
    put: function(callback) {},
    delete: function(callback) {}
  }
}
