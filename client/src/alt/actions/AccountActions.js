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
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/People/update-user', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({ 
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
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

  requestPasswordReset(data){
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/People/requestPasswordReset', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          email: data.email
        })
      })
      .then(response => response.json())
      .then(response => {
        return response;
      })
      .catch((err) => {
        console.log('error:');
        console.dir(err);
        return dispatch([]);
      })
    };
  }

  setPassword(data){
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/People/resetPassword', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          password: data.password,
          confirmation: data.confirmation
        })
      })
      .then(response => response.json())
      .then(response => {
        // do something with response if we want
        return response;
      })
      .catch((err) => {
        console.log('error:');
        console.dir(err);
        return err;
      })
    };
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
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }
}

export default alt.createActions(AccountActions);