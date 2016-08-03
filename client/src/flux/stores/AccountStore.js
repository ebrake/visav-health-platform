var alt = require('../alt');
var AccountActions = require('../actions/AccountActions');

class AccountStore {
  constructor() {
    this.user = {};

    this.bindListeners({
      createAccount: AccountActions.CREATE_ACCOUNT
    });
  }

  handleCreateAccount(data) {
    this.user = data;
  }
}

module.exports = alt.createStore(AccountStore, 'AccountStore');