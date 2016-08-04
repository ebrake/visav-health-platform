import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log('Hello this is facebook!');
  console.dir(response);
}

const postLogin = (arg) => {
  fetch(
    'http://localhost:4000/login', 
    {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'shit', password: 'nigga'}) 
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
          <FacebookLogin cssClass="fb-login-button" appId="1641537292841144" autoLoad={false} fields="name,email,picture" callback={responseFacebook} version="2.7" />
          <button className="fb-login-button" onClick={postLogin}><span>Test login route</span></button>
        </div>
      </div>
    );
  }
});

export default Login;

