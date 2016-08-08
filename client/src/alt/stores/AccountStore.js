var alt = require('../alt');
var AccountActions = require('../actions/AccountActions');

class AccountStore {
  constructor() {
    this.accessToken = undefined;

    this.bindListeners({
      handleLogin: AccountActions.LOGIN_USER,
      handleLogout: AccountActions.LOGOUT_USER
    });
  }

  handleLogin(token) {
    this.accessToken = token.id;
  }

  handleLogout() {
    this.accessToken = undefined;
  }
}

module.exports = alt.createStore(AccountStore, 'AccountStore');