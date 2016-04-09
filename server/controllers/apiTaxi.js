var taxiHelper = require('../helperFunctions/taxiHelper.js');

module.exports = {
  taxiPrice: {
    get: function(req, res) {},
    post: function(req, res) {
      console.log('inside users get apiTaxi.js Controller ');
      taxiHelper.getTaxiPrice(function(data) {
        res.status(200).send(data);
      }, req.body)
    }
  }
}
