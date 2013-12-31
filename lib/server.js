'use strict';
var http = require("http");
var port = '8089';
var findPackageJson = require('./findPackageJson');

var bundles = {};

module.exports = {
  start: function(bundleEmitter, pack){
    bundleEmitter.on('bundle', function(filename, promise){
      if(filename[0] !== '/'){
        filename = '/' + filename;
      }
      bundles[filename] = promise;
    });
    pack.then(function(data){
      var port = data.pack.promethify.port;
      http.createServer(function(request, response) {
        bundles[request.url].then(function(src){
          response.writeHead(200, {'Content-Type': 'application/javascript'});
          response.end(src);
        
        });

      }).listen(parseInt(port, 10));
    
    });

  }
};
