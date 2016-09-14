import loopback from 'loopback'
import Path from 'path'

module.exports = function routes(app) {

  app.use(loopback.static("client/build"));

  app.use(function(req, res) {
    res.sendFile(Path.join(__dirname, '../', '../', 'client', 'build', 'index.html'));
  });

}
