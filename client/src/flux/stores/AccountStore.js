var alt = require('../alt');
var AccountActions = require('../actions/AccountActions');

class AccountStore {
  constructor() {
    this.user = {};

    this.bindListeners({
      createAccount: LocationActions.CREATE_ACCOUNT
    });
  }

  handleCreateAccount(data) {
    this.user = data;
  }
}

module.exports = alt.createStore(LocationStore, 'LocationStore');