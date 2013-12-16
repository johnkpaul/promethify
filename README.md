# TODO
add docs explaining to install scriptjs separately
PR zuul to allow to pass transform
PR browserify to show passing basedir 
add basedir option to promethify

# promethify

Browserify v2 transform to require AMD style and async fetch bundles with minimal configuration


## Usage

This is just in the POC stages. This is untested and so far, not ready for production. It will be one day though, so keep watch.

```javascript

//foo.js

require(['/bar'], function(bar){
  console.log(bar.hello); // async fetch the bar bundle and log 'world'
});

//bar.js

module.exports = {hello: 'world'}
```
