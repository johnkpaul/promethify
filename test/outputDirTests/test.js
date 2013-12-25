'use strict';
var assert = require('assert');

describe('async require', function(){
  it('should provide dependencies', function(done){
    require(['/dep2'], function(dep2){
      assert.equal(dep2, 'world');
      done();
    });
  });

  it('should provide dependencies', function(done){
    require(['/foo/dep'], function(dep){
      assert.equal(dep, 'world');
      done();
    });
  });
});
