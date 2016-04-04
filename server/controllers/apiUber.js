var models = require('../models/apiUber.js');

module.exports = {
  uberPrice: {
    get: function(req, res) {},
    post: function(req, res) {
      console.log('inside users post apiUber.js Controller ');
      models.uberPrice.post(function(data) {
        res.status(200).send(data);
      }, req.body)
    }
  }
}
