import loopback from 'loopback';
import boot from 'loopback-boot';
import { EventEmitter } from 'events';

//Globally set max listeners higher than 11
//Otherwise, loopback-connector-postgresql will cause a mem-leak warning
//because the default maximum is 10
EventEmitter.prototype._maxListeners = 20;

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

      //Generate postgres schema if necessary

      //TODO: populate appModels automatically from model-config.json
      var appModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Note', 'application', 'installation', 'notification']; 
      var dataSource = app.datasources.psql;
      dataSource.isActual(appModels, function(err, actual) {
        //DataSource.isActual() is false if database structure is outdated WRT model files (model-config.json)
        if (!actual) {
          console.log('Database structure update is necessary... commencing autoupdate.')
          dataSource.autoupdate(appModels, function(err, result) {
            if (err) throw err;
            else console.log('Database structure update complete');

          });
        }
      }); 
    });

  }
}
export function startServer(isMainModule) {
  new StartServer(isMainModule);
}
export { startServer };
