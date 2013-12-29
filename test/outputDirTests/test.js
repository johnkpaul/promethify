'use strict';
var assert = require('assert');

describe('output directory loading', function(){
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

  it('should load from node_modules', function(done){
    require(['innersource'], function(innersource){
      assert.equal(innersource(inner), 'var x = 1;');
      done();

      function inner(){var x = 1;}
    });
  });
});
