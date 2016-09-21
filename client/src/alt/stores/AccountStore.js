import alt from '../alt'
import AccountActions from '../actions/AccountActions';

class AccountStore {
  constructor() {
    this.user = undefined;

    this.bindListeners({
      handleLogin: AccountActions.LOGIN_USER,
      handleLogout: AccountActions.LOGOUT_USER,
      handleCreateUser: AccountActions.CREATE_USER,
      handleUpdateUser: AccountActions.UPDATE_USER
    });
  }

  handleLogin(response) {
    if (response && response.data && response.data.status === 'success') {
      this.user = response.data.user;
      localStorage.setItem('accessToken', response.data.token.id);
    } else {
      this.user = undefined;
    }
  }

  handleCreateUser(response) {

  }

  handleUpdateUser(response) {
    if (response && response.data && response.data.status === 'success') {
      this.user = response.data.user;
    }
  }

  handleLogout() {
    this.user = undefined;
  }
}

export default alt.createStore(AccountStore, 'AccountStore');