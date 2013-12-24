# promethify

[![build status](https://secure.travis-ci.org/johnkpaul/promethify.png)](http://travis-ci.org/johnkpaul/promethify)

Browserify v2+ transform to require AMD style and async fetch bundles with minimal configuration


## Usage

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

```
  "promethify": {
    "basedir": "test",
    "hostname": "localhost",
    "port": 8087
  }
```

Configuration is provided through the package.json of your project. There are two required properties.

1. `basedir` This option is the path from the package.json of your project that you want to use for lookups when requiring files asynchronously. 
2. `hostname` This option is the hostname that will be looked up from the browser to find this web server
2. `port` This option is the port number that you want the server that asynchronously fetches the new bundles to bind to. 
