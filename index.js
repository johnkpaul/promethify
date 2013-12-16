'use strict';

var browserify = require('browserify');
var requireify = require('requireify');
var through = require('through');
var innersource = require('innersource');
var detective = require('detective');
var generator = require('inline-source-map');
var combine = require('combine-source-map');
var _ = require('lodash');

var prepend = innersource(addRequire).replace(/\n/g, '');
var postpend = innersource(addModule).replace(/\n/g, '');

var bundles = {};
var server = require('./server').start(bundles);

module.exports = function(filename) {
  var buffer = '';

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var asyncRequres = getAsyncRequires(buffer);
    asyncRequres.forEach(makeBrowserifyBundle);

    var totalPrelude = prepend;
    var offset = totalPrelude.split('\n').length - 1;
    
    var complete = totalPrelude + combine.removeComments(buffer) + postpend;
    
    var map = combine.create().addFile({ sourceFile: filename, source: buffer}, {line: offset});

    this.queue( complete + '\n'+map.comment());

    this.queue(null);
  });

};

function addModule(){
}

function addRequire(){
  /* jshint shadow: true */
  var tmpRequire = require;
  var scriptjs = require('scriptjs');
  var require = function require(keys, callback){
    if(Array.isArray(keys)){
      var urls = keys.map(function(key){ return 'http://localhost:8089'+key; });
      var scriptParam = [urls, function(){
        var deps = keys.map(function(key){ return window.require(key); });
        callback.apply(null, deps);
      }];
      scriptjs.apply(null, scriptParam);
      return;
    }else{
      return tmpRequire.apply(null, arguments);
    }

  };
}

function getAsyncRequires(source){
  var amdRequires = detective.find(source, {nodes: true});
  var amdRequireArray = amdRequires.expressions.map(function(arrString){
    /* jshint evil: true */
    var array = eval(arrString);
    return array;
  });
  return _.flatten(amdRequireArray);
}

function makeBrowserifyBundle(asyncDep){
  var b = browserify({debug: true});
  b.transform(requireify);

  b.add('/Users/jpaul/workspace/promethify/test'+asyncDep).bundle({basedir: process.cwd()+'/test'}, function(err, src){
    bundles[asyncDep] = src;
  });
}


