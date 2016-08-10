// Karma configuration for testing client.
var def_karma_cfg = require('./karma.conf.js');

var entry_cfg = 'karma.webpack.tests.client.js';
var settings = def_karma_cfg.getSettings(entry_cfg);

module.exports = function (config) {
  config.set(settings);
};