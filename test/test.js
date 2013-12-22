'use strict';
var assert = require('assert');
var dep2 = require('./foo/dep2');

describe('async require', function(){
  it('should provide dependencies', function(done){
    require(['/foo/dep2', '/foo/dep'], function(dep2, dep){
      assert.equal(dep.hello, 'world');
      done();
    });
  });

  it('should provide dependencies', function(done){
    require(['/module'], function(module){
      assert.equal(module.hello, 'test');
      done();
    });
  });

  it('should load on demand', function(done){
    assert.equal(window.loaded, undefined);
    require(['/setGlobal'], function(module){
      assert.equal(window.loaded, true);
      done();
    });
  });
});
