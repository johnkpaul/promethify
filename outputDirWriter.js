'use strict';
var findPackageJson = require('./findPackageJson');
var bundles = {};

module.exports = {
  start: function(bundleEmitter, packageData){
    bundleEmitter.on('bundle', function(filename, promise){
      bundles[filename] = promise;
    });
    var dir = packageData.dir;
  
    console.log('the dir' , dir);
    console.log(process.cwd());

  }
};

