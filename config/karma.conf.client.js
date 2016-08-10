// Karma configuration for testing client.
// Enables the running of source code (i.e. JavaScript) against real browsers via the CLI.
var webpack = require('webpack');
var entry_cfg = 'karma.webpack.tests.client.js';

var settings = {

    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome' ],

    singleRun: true,

    frameworks: [ 'mocha' ],

    files: [
      //single entry point for all test cases.
      //webpack will compile all these test files into one test bundle.
      //'karma.webpack.tests.client.js'
      entry_cfg
    ],

    // preprocessors: {
    //   //entry_cfg: 
    //   'karma.webpack.tests.client.js': [ 'webpack', 'sourcemap' ]
    // },

    reporters: [ 'dots' ],

    webpack: {
      // webpack will generate sourcemaps.
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }
  };
  settings['preprocessors'] = {};
  settings['preprocessors'][entry_cfg] = ['webpack', 'sourcemap'];

module.exports = function (config) {
  config.set(settings);
};