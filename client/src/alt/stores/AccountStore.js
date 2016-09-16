import alt from '../alt'
import AccountActions from '../actions/AccountActions';

class AccountStore {
  constructor() {
    this.user = undefined;
    this.role = undefined;

    this.bindListeners({
      handleLoginOrUpdate: AccountActions.LOGIN_USER,
      handleLoginOrUpdate: AccountActions.UPDATE_USER,
      handleLogout: AccountActions.LOGOUT_USER,
    });
  }

  handleLoginOrUpdate(user) {
    this.user = user;
    this.role = (user.roles && user.roles[0]) ? user.roles[0].name : undefined;
  }

  handleLogout() {
    this.user = undefined;
  }
}

export default alt.createStore(AccountStore, 'AccountStore');