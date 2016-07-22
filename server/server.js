import loopback from 'loopback';
import boot from 'loopback-boot';

class StartServer {

  constructor() {

    const app = loopback();

    boot(app, __dirname, error => {

      if (error) {
        throw error;
      }

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


      //GENERATE POSTGRES SCHEME IF NECESSARY
      //DataSource.isActual() is false if database structure is outdated WRT model files (model-config.json)
      //TODO: populate appModels automatically from model-config.json
      var appModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Note'];
      var dataSource = app.datasources.psql;
      dataSource.isActual(appModels, function(err, actual) {
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
let startServer = new StartServer();
export default startServer;
