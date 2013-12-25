var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var staticCP, testCP;
var command = './node_modules/.bin/static';
var command2 = 'npm run outputdirtest';

staticCP = spawn(command, ['test/outputDirTests', '-p', '8089']);

staticCP.stdout.pipe(process.stdout);
staticCP.stderr.pipe(process.stderr);

staticCP.stdout.once('data', function (error, stdout, stderr) {

  testCP = spawn('npm', ['run', 'outputdirtest']);
  testCP.stdout.pipe(process.stdout);
  testCP.stderr.pipe(process.stderr);
  testCP.on('close', function (code) {
      staticCP.kill();
      process.exit(code);
  });

});
