'use strict';
var http = require("http");
var port = '8089';

module.exports = {
  start: function(bundles){
    http.createServer(function(request, response) {
      response.writeHead(200, {'Content-Type': 'application/javascript'});
      response.end(bundles[request.url]);

    }).listen(parseInt(port, 10));

  }
};
