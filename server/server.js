import loopback from 'loopback';
import boot from 'loopback-boot';

class StartServer {

  constructor(isMainModule) {

    const app = loopback();

    boot(app, __dirname, error => {

      if (error) throw error;
      if (!isMainModule) return;

      const server = app.listen(() => {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
          var explorerPath = app.get('loopback-component-explorer').mountPath;
          console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
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
