# promethify

[![build status](https://secure.travis-ci.org/johnkpaul/promethify.png)](http://travis-ci.org/johnkpaul/promethify)

Browserify v2+ transform to require AMD style and async fetch bundles with minimal configuration


## Usage

```javascript

//example.js

'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var stateManager = require('./core/state_manager');
var router = require('../../shared/routes/client_routes');
var routeHandler = require('./core/router/route_handler');
var sync = require('./core/sync');

stateManager.init();

$(function(){

  Backbone.history.start({
    root: '/',
    pushState: stateManager.history_fix().push_state(),
    silent: false
  });

  // config.js and analytics.js are inside the "basedir": "test"
  // from the config in package.json, these scripts are then
  // loaded in with script.js
  require(['config', 'analytics'], function(config, analytics) {
    alert(config.env);
    analytics.init();
  });

});

```

## Configuration

```
  "promethify": {
    "basedir": "test",
    "hostname": "localhost",
    "port": 8087
  }
```

Configuration is provided through the package.json of your project. There are three required properties.

1. `basedir` This option is the path from the package.json of your project that you want to use for lookups when requiring files asynchronously. 
2. `hostname` This option is the hostname that will be looked up from the browser to find this web server
2. `port` This option is the port number that you want the server that asynchronously fetches the new bundles to bind to. 
