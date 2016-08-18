import alt from '../alt'
import AccountActions from '../actions/AccountActions';

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

export default alt.createStore(AccountStore, 'AccountStore');