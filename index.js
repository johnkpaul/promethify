'use strict';

var through = require('through');
var innersource = require('innersource');
var detective = require('detective');
var generator = require('inline-source-map');
var combine = require('combine-source-map');
var _ = require('lodash');

var prepend = innersource(addRequire).replace(/\n/g, '');
var postpend = innersource(addModule).replace(/\n/g, '');

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
  var global = (function(){ return this; }).call(null);
  if(typeof __filename !== 'undefined'){
    global.require[__filename.substring(0, __filename.length - 3)] = module.exports;
  }
}

function addRequire(){
  var global = (function(){ return this; }).call(null);
  if(!global.require){
    global.require = global.require || function require(key){return global.require[key];};

    (function(){
    var require = global.require;
    var ret = global.require;
        
    Object.defineProperty(global, 'require', {
        get: function(){
          return ret;
        },
        set: function(newRequire){
            ret = function(key){
                if(require[key]){
                  return require[key];
                }else{
                  var temp = ret;
                  var module;
                  ret = newRequire;
                  try {
                    module = newRequire(key);
                  }
                  catch(e){
                    ret = temp;
                    throw e;
                  }
                  ret = temp;
                  return module;
                }
            };
            for(var key in require){
              ret[key] = require[key];
            }
        }
    });

    })();
  }

}

function getAsyncRequires(source){
  var amdRequires = detective.find(source, {nodes: true});
  var amdRequireArray = amdRequires.expressions.map(function(arrString){
    var array = eval(arrString);
    return array;
  });
  return _.flatten(amdRequireArray);
}

function makeBrowserifyBundle(asyncDep){

}
