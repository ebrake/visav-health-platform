import passport from 'passport';
import { PassportConfigurator } from 'loopback-component-passport';
import passportProviders from './passport-providers';
import { generateKey } from 'loopback-component-passport/lib/models/utils';

const passportOptions = { };

PassportConfigurator.prototype.init = function passportInit(noSession) {

};

export default function setupPassport(app) {

  const configurator = new PassportConfigurator(app);

  configurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });

  configurator.init();

  Object.keys(passportProviders).map(function(strategy) {
    var config = passportProviders[strategy];
    config.session = config.session !== false;

    console.log(config);
    configurator.configureProvider(
      strategy,
      {
        config,
        passportOptions
      }
    );
  });
}