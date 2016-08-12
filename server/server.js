import loopback from 'loopback';
import boot from 'loopback-boot';
import { EventEmitter } from 'events';
//Globally set max listeners higher than 11
//Otherwise, loopback-connector-postgresql will cause a mem-leak warning
//because the default maximum is 10
EventEmitter.prototype._maxListeners = 100;

class StartServer {

  constructor(isMainModule) {

    const app = loopback();
    const port = process.env.PORT;
    
    boot(app, __dirname, error => {

      if (error) throw error;
      if (!isMainModule) return;

      const server = app.listen(port, () => {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
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
export function startServer(isMainModule) {
  new StartServer(isMainModule);
}
export { startServer };
