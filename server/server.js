/** @server */
if (process.env.NODE_ENV ==='production') {
  // Add production application monitoring support with New Relic
  require('newrelic');
}
import loopback from 'loopback';
import boot from 'loopback-boot';
import { EventEmitter } from 'events';
import enforce from 'express-sslify';
import globalConfig from '../global.config';

//Globally set max listeners higher than 11
//Otherwise, loopback-connector-postgresql will cause a mem-leak warning
//because the default maximum is 10
EventEmitter.prototype._maxListeners = 100;

/** The first script executed to boot the Loopback application
 */
class StartServer {

  /**
   * Constructor
   * @param {bool} isMainModule - is script launched as a main module? If true, the server will bind to port.
   */
  constructor(isMainModule) {

    const app = loopback();

    // Put this on the app so it's accessible.
    app.globalConfig = globalConfig;

    const port = process.env.PORT;
    
    if (process.env.NODE_ENV !=='development') {
      // Enforce SSL in production.
      // Use enforce.HTTPS({ trustProtoHeader: true }) behind load balancer (e.g. Heroku)
      app.use(enforce.HTTPS({ trustProtoHeader: true }));
    }

    boot(app, __dirname, error => {

      if (error) throw error;
      if (!isMainModule) return;

      // Require env keys
      var requiredEnvKeys = [
      "NODE_ENV",
      "OPENTOK_API_KEY",
      "OPENTOK_SECRET",
      "POSTMARK_API_TOKEN",
      "POSTMARK_SMTP_SERVER"];
      requiredEnvKeys.forEach(function(key) {
        if (!process.env[key]) {
          console.log("WARNING, you must specify an .env key/value for "+key);
          process.exit(1);
        }
      });

      const server = app.listen(port, () => {
        app.emit('started');
        var requireSSL = (process.env.NODE_ENV !== 'development');
        var baseUrl = (requireSSL ? 'https://' : 'http://') + app.get('host') + ':' + app.get('port');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
          var explorerPath = app.get('loopback-component-explorer').mountPath;
          console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
          console.log('Visualize your Data Models at %s%s', baseUrl, '/diagrammer');
        }
      });

      // Put this on the app so it's accessible.
      app.server = server;

    });
  }
}

export default function startServer(isMainModule) {
  new StartServer(isMainModule);
}
