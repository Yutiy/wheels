#! /usr/bin/env node

const path = require('path');
const Compiler = require('./libs/compiler.js');
const config = require(path.resolve('webpack.config.js'));

const compiler = new Compiler(config);
compiler.run();
