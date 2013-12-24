'use strict';

var browserify = require('browserify');
var requireify = require('requireify');
var through = require('through');
var innersource = require('innersource');
var detective = require('detective');
var generator = require('inline-source-map');
var combine = require('combine-source-map');
var _ = require('lodash');
var findPackageJson = require('./findPackageJson');
var scriptjsLocation = require.resolve('scriptjs');
var Q = require('q');

var postpend = innersource(addModule).replace(/\n/g, '');

var bundles = {};
var server = require('./server').start(bundles);
var pack;

module.exports = function(filename) {
  if(!pack){
    pack = findPackageJson(filename);
  }
  var buffer = '';

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    if(_.contains(filename, 'scriptjs')){
       this.queue(buffer);
       this.queue(null);
       return;
    }
    pack.then(function(data){
      var port = data.pack.promethify.port;
      var hostname = data.pack.promethify.hostname;
      var prepend = innersource(addRequire)
                    .replace('SCRIPTJS_LOC', scriptjsLocation)
                    .replace('HOSTNAME', hostname)
                    .replace('PORT_NUM', port)
                    .replace(/\n/g, '');
      var asyncRequres = getAsyncRequires(buffer);
      asyncRequres.forEach(makeBrowserifyBundle);

      var totalPrelude = prepend;
      var offset = totalPrelude.split('\n').length - 1;
      
      var complete = totalPrelude + combine.removeComments(buffer) + postpend;
      
      var map = combine.create().addFile({ sourceFile: filename, source: buffer}, {line: offset});

      this.queue( complete + '\n'+map.comment());

      this.queue(null);
      
    }.bind(this)).done();
  });

};

function addModule(){
}


function addRequire(){
  /* jshint shadow: true */
  var tmpRequire = require;
  var scriptjs = require('SCRIPTJS_LOC');
  var require = function require(keys, callback){
    if(Array.isArray(keys)){
      var urls = keys.map(function(key){ return 'http://HOSTNAME:PORT_NUM'+key; });
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
  var def = Q.defer();
  bundles[asyncDep] = def.promise;
  var b = browserify({debug: true});

  b.transform(requireify);

  pack.then(function(data){
    var basedir = data.pack.promethify.basedir;
    var dir = data.dir;

    b
      .add(dir + '/' + basedir + asyncDep)
      .bundle({basedir: dir + '/' + basedir}, function(err, src){
        def.resolve(src);
      });
    
  }).done();
}
