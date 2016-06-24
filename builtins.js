"use strict";

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var _ = require('underscore');

function loadBuiltins() {
    var builtins = {};
    var root = path.resolve(path.join(__dirname, 'builtins'));
    var bins = glob.sync(path.join(root, '*'));
    bins = _.filter(bins, function(bin) {
        return isDir(bin);
    });
    for (var bin of bins) {
        var metapath = path.join(bin, 'metadata', 'metadata.json');
        if (isFile(metapath)) {
            var metadata = fs.readFileSync(metapath);
            metadata = JSON.parse(metadata);
            metadata.path = bin;
            builtins[metadata.title] = metadata;
        }
    }
    return builtins;
}

function isDir(candidate) {
    try {
        return fs.lstatSync(candidate).isDirectory();
    } catch (e) {
        return false;
    }
}

function isFile(candidate) {
    try {
        return fs.lstatSync(candidate).isFile();
    } catch (e) {
        return false;
    }
}

module.exports = loadBuiltins();