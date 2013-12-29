'use strict';
var assert = require('assert');

describe('async require', function(){
  it('should resolve names using browserify-shim config', function(done){
    assert.equal(window.jQuery, undefined);
    require(['jquery'], function(jQuery){
      assert.equal(jQuery().jquery, '2.0.3');
      done();
    });
  });
});
