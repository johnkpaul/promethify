'use strict';

var fs = require('fs');
var vm = require('vm');
var assert = require('assert');
var util = require('util');

var browserify = require('browserify');
var coffeeify = require('coffeeify');
var promethify = require('../index');
var innersource = require('innersource');
var convert = require('convert-source-map');

var modulePath = __dirname + '/module.js';
var exported = __dirname + '/compiled.js';

var b = browserify();

b.transform(promethify);

b.require(__dirname + '/foo/dep2.js', {expose: 'x'});

b.add(modulePath)
 .bundle(function(err, src){
   var completeScript = src+innersource(tests);
   var script = vm.createScript(completeScript);
   fs.writeFileSync(__dirname+'/compiled.js', completeScript);

   var context = getContext();
   context.self = context.window;

   script.runInNewContext(context);

   assert.equal(context.window.test, 'world');
   assert.equal(context.window.test2, 'world');
 });


function getContext(){
  return {console:{log: function(){
     console.log.apply(console, arguments);
   }},window:{}};

}

function tests(){
  window.test = require("x");
  try{
    var dne = require('does_not_exist');
  }
  catch(e){
    dne = undefined;
  }
  window.test2 = require("/foo/dep").hello;
}
