import alt from '../alt'

class AccountActions {
  loginUser(data){
    localStorage.setItem('accessToken', data.token.id);
    return data.token.user;
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    return true;
  }
}

export default alt.createActions(AccountActions);