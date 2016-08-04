import React, { Component } from 'react';

const createUser = (arg) => {
  fetch(
    'http://localhost:4000/user/create', 
    {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'nolan.thorn@krisandbrake.com', password: 'testtest'}) 
    }
  )
  .then(function(response){
    console.log('ok');
    console.log(response);
  })
}

var Login = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  render: function () {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <button className="fb-login-button" onClick={createUser}><span>Create User</span></button>
        </div>
      </div>
    );
  }
});

export default Login;

