var alt = require('../alt');
var AccountActions = require('../actions/AccountActions');

class AccountStore {
  constructor() {
    this.user = undefined;

    this.bindListeners({
      handleLogin: AccountActions.LOGIN_USER,
      handleLogout: AccountActions.LOGOUT_USER
    });
  }

  handleLogin(user) {
    this.user = user;
  }

  handleLogout() {
    this.user = undefined;
  }
}

module.exports = alt.createStore(AccountStore, 'AccountStore');