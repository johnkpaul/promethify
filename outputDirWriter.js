'use strict';
var findPackageJson = require('./findPackageJson');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = {
  start: function(bundleEmitter, packageData){
    bundleEmitter.on('bundle', function(filename, promise){
      promise.then(function(src){
        var dir = packageData.dir;
        var outputDir = packageData.pack.promethify.outputDir;
        var fullDir = path.join(dir, outputDir);
        console.log('rwrintg file! ', filename);
        mkdirp.sync(path.join(fullDir, path.dirname(filename)));
        fs.writeFileSync(path.join(fullDir, filename), src);
      });
    });

  }
};

