import alt from '../alt'

class AccountActions {
  loginUser(userInformation){
    return function (dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/signin', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: userInformation.email,
          password: userInformation.password
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        var craftedResponse = { data: { error: err, status: 'failure', message: err.message } }
        dispatch(craftedResponse);
        return craftedResponse;
      })
    };
  }

  createUser(userInformation){
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/People/signup', {
        method: 'POST', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organizationName: userInformation.organizationName, 
          email: userInformation.email, 
          password: userInformation.password 
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {

      })
    }
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    return true;
  }
}

export default alt.createActions(AccountActions);