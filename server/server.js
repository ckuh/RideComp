var express = require('express');
var bodyParser = require('body-parser');
var routeUber = require('./routes/routeUber.js')

var http = require('http');
var app = express();
var server = http.createServer(app);

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', routeUber)
app.use(express.static('./public'));

server.listen(PORT, function() {
  console.log('listening on port ', PORT);
});
