import alt from '../alt'
class AccountActions {
  loginUser(data){
    localStorage.setItem('accessToken', data.token.id);
    return data;
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    return true;
  }
}
export default alt.createActions(AccountActions);