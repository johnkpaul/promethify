# promethify

[![build status](https://secure.travis-ci.org/johnkpaul/promethify.png?branch=master)](http://travis-ci.org/johnkpaul/promethify)

Browserify v2+ transform to require AMD style and async fetch bundles with minimal configuration

After you have added the correct configuraton to your package.json, it's as simple as: 

    browserify --transform promethify main.js > bundle.js


## Usage

### Example 1
```javascript

//main.js
var $ = require('jquery');

$('.buy-product').click(function(){
  require(['/shopping-cart'], function(shoppingCart) {
    // only downloaded shopping cart code including jqueryui when necessary
    shoppingCart.open();
  });
});

//shopping-cart.js
var $ = require('jquery');
require('jqueryui');

module.exports = {
  open: function(){
    // open modal with jquery ui
  }
}
```

### Example 2
```javascript
//foo.js

console.log(window.loaded) // undefined

require(['/bar'], function(bar){
  console.log(bar.hello); // async fetch the bar bundle and log 'world'
  console.log(window.loaded); // true
});

//bar.js

module.exports = {hello: 'world'};
window.loaded = true;
```

## Configuration

This transform has two different modes of use.

1. Self hosted. This will spin up a local web server to automatically serve the bundles that are requested on the fly. 
1. Bring Your Own Hosting (BYOH). This will spit out all of the bundles to an output directory that you can serve separately, from a CDN or wherever you'd like. 
Configuration is provided through the package.json of your project. 

Self Hosted configuration:
```
  "promethify": {
    "basedir": "test",
    "hostname": "localhost",
    "port": 8087
  }
```

BYOH configuration:
```
  "promethify": {
    "basedir": "src",
    "hostname": "cdn.yourwebsite.com",
    "outputDir": "out",
    "outputDeployPath": "static/project/releases",
    "port": 8089
  }
```

There are three required properties for either mode. 

1. `basedir` This option is the path from the package.json of your project that you want to use for lookups when requiring files asynchronously. 
2. `hostname` This option is the hostname that will be looked up from the browser
3. `port` This option is the port number that you want the server that asynchronously fetches the new bundles to bind to. 
There are three required properties.

There are two properties that will put promethify into BYOH mode.  If one is used, they are both required.

1. `outputDir` This option is the file system path from the package.json of your project that all of the new bundles will be written into.
2. `outputDeployPath` This option is the path that will be prepended to the bundle names when looked up from the browser.

When in BYOH mode, the browser will make a request that looks like `//hostname:port/outputDeployPath/BUNDLE_NAME` You should make sure to serve the outputDir at the correct path.
