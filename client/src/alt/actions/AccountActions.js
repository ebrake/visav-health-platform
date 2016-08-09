import alt from '../alt'
class AccountActions {
  loginUser(data){
    return data;
  }

  logoutUser(){
    //suppress pointless warning
    return true;
  }
}
export default alt.createActions(AccountActions);