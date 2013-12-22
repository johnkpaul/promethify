'use strict';
var http = require("http");
var port = '8089';
var findPackageJson = require('./findPackageJson');
var pack = findPackageJson();

module.exports = {
  start: function(bundles){
    pack.then(function(data){
      var port = data.pack.promethify.port;
      http.createServer(function(request, response) {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.end(bundles[request.url]);

      }).listen(parseInt(port, 10));
    
    });

  }
};
