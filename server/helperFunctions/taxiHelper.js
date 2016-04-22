var request = require('request');
var taxiKey = require('../config/config.js').taxiKey;

exports.getTaxiPrice = function(callback, params) {
  var url = 'https://api.taxifarefinder.com/fare?key='+taxiKey+'&origin='+params.url;
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('inside taxi: ', body);
      callback(body);
    } else {
      callback(err);
    }
  })
}
