var models = require('../models/apiLyft.js');

module.exports = {
  lyftToken: {
    get: function(req, res) {
      console.log('inside users get apiLyft.js Controller ');
      models.lyftToken.get(function(data) {
        res.status(200).send(data);
      })
    },
    post: function(req, res) {}
  }
}
