'use strict';
var Q = require('q');
var findParentDir = require('find-parent-dir');

module.exports = function(){
  var def = Q.defer();
  findParentDir(__dirname, 'package.json', function(err, dir){
     if(err) {
       def.reject(err);
     }
    var pack = require(dir + '/package');
    def.resolve({pack: pack, dir: dir});
  });
  return def.promise;
};
