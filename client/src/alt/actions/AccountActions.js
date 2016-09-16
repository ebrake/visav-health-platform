import alt from '../alt'

class AccountActions {
  loginUser(data){
    localStorage.setItem('accessToken', data.token.id);
    return data.user;
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    return true;
  }

  updateUser(user){
    return user;
  }
}

export default alt.createActions(AccountActions);