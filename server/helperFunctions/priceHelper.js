var uber = require('../config.js').uber;

exports.getEstimate = function(callback, params) {
  console.log(params);
  uber.estimates.price(params, function(error, response) {
    if (error) {
      console.error(error);
    } else {
      console.log(response);
      callback(response);
    }
  });
}
