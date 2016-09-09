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

function createRoles(Role, attempt){
  attempt = attempt || 0;

  var roles = ['doctor', 'patient', 'caregiver']
    , threshold = 2;

  if (attempt >= threshold) 
    throw new Error("Issue building roles on boot. See createRoles in server/boot/roles.js.");

  Promise.all(roles.map(function(roleName){
    return createRole(Role, roleName);
  }))
  .then(function(result){
    console.log('The following roles exist:');
    console.log(roles);
  })
  .catch(function(err){
    createRoles(Role, (attempt+1));
  })
}

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */

  createRoles(app.models.Role);
};
