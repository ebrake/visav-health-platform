import loopback from 'loopback'
import Path from 'path'

const clientDir = (process.env.NODE_ENV!=="development" ? "client-dist" : "client")

module.exports = function routes(app) {

  app.use(loopback.static(clientDir+"/build"));

  app.use(function(req, res) {
    res.sendFile(Path.join(__dirname, '../', '../', clientDir, 'build', 'index.html'));
  });

}
