'use strict';
var http = require("http");
var port = '8089';

module.exports = {
  start: function(bundles){
    http.createServer(function(request, response) {
      bundles[request.url].pipe(process.stdout);

    }).listen(parseInt(port, 10));

  }
};
