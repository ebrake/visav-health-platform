var alt = require('../alt');

class AccountActions {
  loginUser(data){
    return data;
  }

  logoutUser(){
    //suppress pointless warning
    return true;
  }
}

module.exports = alt.createActions(AccountActions);