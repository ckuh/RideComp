var priceHelper = require('../helperFunctions/priceHelper.js');

module.exports = {
  uberPrice: {
    get: function(callback, params) {},
    post: function(callback, params) {
      console.log('inside users post apiUber.js Models');
      priceHelper.getEstimate(callback, params);
    },
    put: function(callback) {},
    delete: function(callback) {}
  }
}
