var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//change name after we change the placeholder.js
var db = require('./db/config');

// see routes line 144 for description
var specialHashRegex = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(require('./routes'));



app.listen(3000);
console.log('server running on port 3000');
