var express = require('express');
var bodyParser = require('body-parser');
var routeUber = require('./routes/routeUber.js');
var routeLyft = require('./routes/routeLyft.js');
var routeTaxi = require('./routes/routeTaxi.js');

var app = express();

module.exports.app = app;
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name');
  next();
});

app.set('port', process.env.PORT || 3000);

app.use('/api', routeTaxi);
app.use('/api', routeUber);
app.use('/api', routeLyft);
app.use('/config', express.static('./server/config'));
app.use(express.static('./public'));

if (module.parent) {
  module.exports = app;
} else {
  app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}
