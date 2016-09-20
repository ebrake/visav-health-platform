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
      this.role = this.user.role ? this.user.role.name : undefined;
      localStorage.setItem('accessToken', response.data.token.id);
    } else {
      this.user = undefined;
      this.role = undefined;
    }
    console.log(this);
  }

  handleCreateUser(response) {

  }

  handleUpdateUser(user) {
    this.user = user;
    this.role = user.role ? user.role.name : undefined;
  }

  handleLogout() {
    this.user = undefined;
    this.role = undefined;
  }
}

export default alt.createStore(AccountStore, 'AccountStore');