var credentials = require('../config.js').credentials;
// Initialize the OAuth2 Library
var oauth2 = require('simple-oauth2')(credentials);
var token;
var makeToken = function(callback) {
  oauth2.client
    .getToken({})
    .then(function saveToken(result) {
      token = oauth2.accessToken.create(result);
      callback(token);
    })
    .catch(function logError(error) {
      console.log('Access Token error', error.message);
      callback(error.message);
    });
}

exports.getToken = function(callback) {
  if (token) {
    if (token.expired()) {
      token.refresh().then(function saveToken(result) {
        token = result;
        callback(token);
      });
    } else {
      callback(token);
    }
  } else {
    makeToken(callback);
  }
}
