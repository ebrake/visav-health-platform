var alt = require('../alt');
var AccountActions = require('../actions/AccountActions');

class AccountStore {
  constructor() {
    this._user = undefined;
    this._accessToken = undefined;

    this.bindListeners({
      loginUser: AccountActions.LOGIN_USER,
      logoutUser: AccountActions.LOGOUT_USER
    });
  }

  loginUser(data) {
    this._user = data.user;
    this._accessToken = data.id;
  }

  logoutUser() {
    this._user = undefined;
    this._accessToken = undefined;
  }
}

module.exports = alt.createStore(AccountStore, 'AccountStore');