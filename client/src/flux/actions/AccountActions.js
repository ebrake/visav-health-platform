var alt = require('../alt');

class AccountActions {
  loginUser(data){
    return data;
  }

  logoutUser(){
    
  }
}

module.exports = alt.createActions(AccountActions);