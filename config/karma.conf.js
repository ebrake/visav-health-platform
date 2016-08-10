// Karma default configuration.
// Enables the running of source code (i.e. JavaScript) against real browsers via the CLI.
var webpack = require('webpack');

var settings = {

    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome' ],

    singleRun: true,

    frameworks: [ 'mocha' ],

    // files: [
    //   //single entry point for all test cases.
    //   //webpack will compile all these test files into one test bundle.
    //   entry_cfg
    // ],

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

module.exports = {
  settings: settings
};