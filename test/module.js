'use strict';
require(['/foo/dep2', '/foo/dep'], function(dep2){
  debugger;
});
var innersource = require('innersource');

exports = module.exports = {
  hello: 'test'
};
