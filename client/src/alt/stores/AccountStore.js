import alt from '../alt'
import AccountActions from '../actions/AccountActions';

class AccountStore {
  constructor() {
    this.user = undefined;
    this.role = undefined;

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
      this.role = (this.user.roles && this.user.roles[0]) ? this.user.roles[0].name : undefined;
      localStorage.setItem('accessToken', response.data.token.id);
    } else {
      this.user = undefined;
      this.role = undefined;
    }
  }

  handleCreateUser(response) {

  }

  handleUpdateUser(user) {
    this.user = user;
    this.role = (user.roles && user.roles[0]) ? user.roles[0].name : undefined;
  }

  handleLogout() {
    this.user = undefined;
    this.role = undefined;
  }
}

export default alt.createStore(AccountStore, 'AccountStore');