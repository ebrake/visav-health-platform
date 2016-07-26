import loopback from 'loopback';
import boot from 'loopback-boot';
import { EventEmitter } from 'events';
import fs from 'fs';
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

      //Determine which app models require postgres
      var modelConfigObj = JSON.parse(fs.readFileSync('./server/model-config.json', 'utf8'));
      var appModels = [];
      for(var key in modelConfigObj){
        var value = modelConfigObj[key];
        if (key != "_meta" && value.dataSource == "psql") {
          appModels.push(key);
        }
      }
      //Generate postgres schema if necessary
      var dataSource = app.datasources.psql;
      dataSource.isActual(appModels, function(err, actual) {
        //DataSource.isActual() is false if database structure is outdated WRT model files (model-config.json)
        if (!actual) {
          console.log('Database structure update is necessary... commencing autoupdate.')
          console.log('Postgres models used by app:\n' + JSON.stringify(appModels) );
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
