import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log('Hello this is facebook!');
  console.dir(response);
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
        </div>
      </div>
    );
  }
});

export default Login;

