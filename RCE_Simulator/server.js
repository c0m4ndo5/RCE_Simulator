// call the packages we need
var debug = require('debug')('RCE_Simulator');
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

var api = require('./api.js');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', api);

// START THE SERVER
// =============================================================================
app.listen(port, 'localhost');
console.log('Magic happens on port ' + port);