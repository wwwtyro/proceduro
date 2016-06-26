#!/usr/bin/env node

var fs = require('fs')
var path = require('path');
var cp = require('child_process');

var builtins = path.resolve(path.join(__dirname, 'builtins'));

fs.readdirSync(builtins).forEach(function(bi) {
    var biPath = path.join(builtins, bi);
    console.log(biPath);
    if (!fs.existsSync(path.join(biPath, 'package.json'))) {
        return;
    }
    cp.spawn('npm', ['install'], {
        env: process.env,
        cwd: biPath,
        stdio: 'inherit'
    });
});
