'use strict';

var Promise = require('bluebird');

function createRole(Role, roleName) {
  return Role.find({
    where: {
      name: roleName
    }
  })
  .then(function(found){
    if (found.length > 0) {
      return found[0];
    } else {
      return Role.create({
        name: roleName
      });
    }
  })
}

function createRoles(Role, cb){
  var roles = ['doctor', 'patient', 'caregiver', 'owner', 'admin'];

  return Promise.all(roles.map(function(roleName){
    return createRole(Role, roleName);
  }))
  .then(function(result){
    console.log('The following roles exist:');
    console.log(roles);
    return cb();
  }, function(err){
    return cb(err);
  })
}

/**
 * A boot script function that generates default roles
 * @module boot/03-roles
 */
module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */

  return createRoles(app.models.Role, cb);
};