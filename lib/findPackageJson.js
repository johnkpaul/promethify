'use strict';
var Q = require('q');
var path = require('path');
var findParentDir = require('find-parent-dir');

module.exports = function(filename){
  var def = Q.defer();
  findParentDir(path.dirname(filename), 'package.json', function(err, dir){
     if(err) {
       def.reject(err);
     }
    var fullDir = dir === '.' ? path.dirname(filename) : dir;
    var pack = require(fullDir + '/package');
    def.resolve({pack: pack, dir: fullDir});
  });
  return def.promise;
};
