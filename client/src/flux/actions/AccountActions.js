var alt = require('../alt');

class AccountActions {
  createAccount(data) {
    console.log('Hello!');
    console.dir(data);
    console.log(fetch);
    return {
      email: 'test@123.com'
    }
  }
}

module.exports = alt.createActions(AccountActions);