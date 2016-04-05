var uber = require('../config.js').uber;

exports.getEstimate = function(callback, params) {
  uber.estimates.price(params, function(error, response) {
    if (error) {
      console.error(error);
      callback(error);
    } else {
      callback(response);
    }
  });
}
