import fs from 'fs';

/**
 * A boot script function that automatically updates the PostgreSQL schema.
 * @module boot/updateSchema
 */
module.exports = function enableAuthentication(app, cb) {
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
    if (err) cb(err);
    //DataSource.isActual() is false if database structure is outdated WRT model files (model-config.json)
    if (!actual) {
      console.log('Database structure update is necessary... commencing autoupdate.')
      console.log('Postgres models used by app:\n' + JSON.stringify(appModels) );
      dataSource.autoupdate(appModels, function(err, result) {
        if (err) cb(err);
        else {
          console.log('Database structure update complete');
          cb();
        }
      });
    } else {
      cb();
    }
  }); 
};
