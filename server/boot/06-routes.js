import loopback from 'loopback'
import Path from 'path'

/**
 * A boot script function that serves the static HTML template that loads the webpack distribution
 * @module boot/06-routes
 */
module.exports = function routes(app) {

  app.use(loopback.static("client/build"));

  app.use(function(req, res) {
    res.sendFile(Path.join(__dirname, '../', '../', 'client', 'build', 'index.html'));
  });
}
