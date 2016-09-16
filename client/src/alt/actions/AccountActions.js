import alt from '../alt'

class AccountActions {
  loginUser(data){
    return function (dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/signin', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        var craftedResponse = { data: { error: err, status: 'failure', message: err.message } };
        dispatch(craftedResponse);
        return craftedResponse;
      })
    };
  }

  logoutUser(){
    localStorage.removeItem('accessToken');
    return true;
  }

  updateUser(user){
    return user;
  }

  createUser(data){
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/People/signup', {
        method: 'POST', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organizationName: data.organizationName, 
          email: data.email, 
          password: data.password 
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        var craftedResponse = { data: { error: err, status: 'failure', message: err.message } };
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }

  inviteUser(data) {
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/invite', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: data.email, role: data.role.value })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        var craftedResponse = { data: { error: err, status: 'failure', message: err.message } };
        dispatch(response);
        return response;
      })
    }
  }
}

export default alt.createActions(AccountActions);