'use strict';

var fs = require('fs');
var assert = require('assert');
var util = require('util');

var browserify = require('browserify');
var promethify = require('../index');
var innersource = require('innersource');
var convert = require('convert-source-map');

var modulePath = __dirname + '/test.js';
var exported = __dirname + '/compiled.js';

var b = browserify();

b.transform(promethify);


b.add(modulePath)
 .bundle(function(err, src){
   var completeScript = src;
   fs.writeFileSync(__dirname+'/compiled.js', completeScript);
 });

