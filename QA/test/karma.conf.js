// Karma default configuration.
// Enables the running of source code (i.e. JavaScript) against real browsers via the CLI.
// Karma as a test runner, Mocha as a testing framework, and Webpack as a module loader.

var webpack = require('webpack');

function isDebug(argument) {
    return argument === '--debug';
}

var settings = {

    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome' ],

    //turn it 'false' to enable debug, the browser will keep opened.
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
          { test: /\.js/, exclude:/node_modules/, loader: 'babel-loader' },
          { test: /\.jsx/, exclude:/node_modules/, loader: 'babel-loader' }     
        ]
      }
    },

    webpackServer: {
      // keep the output clear.
      noInfo: true
    }
  };

if(process.argv.some(isDebug)){
  settings.singleRun = false;
}

var getSettings = function(entry_cfg){
  settings['files'] = [entry_cfg];
  settings['preprocessors'] = {};
  settings['preprocessors'][entry_cfg] = ['webpack', 'sourcemap'];
  return settings;
}

module.exports = {
  getSettings: getSettings
};