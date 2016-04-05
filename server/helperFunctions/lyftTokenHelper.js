var credentials = require('../config.js').credentials;
// Initialize the OAuth2 Library
var oauth2 = require('simple-oauth2')(credentials);
var token;
var tokenConfig = {};

exports.getToken = function(callback) {
  oauth2.client
  .getToken(tokenConfig)
  .then(function saveToken(result) {
    token = oauth2.accessToken.create(result);
    callback(result);
  })
  .catch(function logError(error) {
    console.log('Access Token error', error.message);
    callback(error.message);
  });
}
