import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import AccountActions from '../flux/actions/AccountActions';

const responseFacebook = (response) => {
  console.log('Hello this is facebook!');
  console.dir(response);
}

var Login = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  login: function() {
    console.log("Fired login with accessToken "+localStorage.getItem('accessToken')+"...");
    fetch('http://localhost:4000/user/login', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(function(response){
      return response.json();
    })
    .then(function(data){
      localStorage.setItem('accessToken', data.token.id);
    })
    .catch(function(err){
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error:');
      console.dir(err);
    })
  },
  getInitialState: function() {
    return {
      email: '',
      password: ''
    }
  },
  handleChange: function(key) {
    return function(event) {
      var state = {};
      state[key] = event.target.value;
      this.setState(state);
    }.bind(this);
  },
  render: function () {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <input  className="account-text-field" placeholder="Email" value={this.state.email} 
                  onChange={this.handleChange('email')} />

          <input  className="account-text-field" placeholder="Password" value={this.state.password} 
                  onChange={this.handleChange('password')} />

          <button   className="fb-login-button" onClick={this.login}>
            <span>Login</span>
          </button>

          {/*<FacebookLogin  cssClass="fb-login-button" appId="1641537292841144" autoLoad={false} fields="name,email,picture"  
                          callback={responseFacebook} version="2.7" />*/}
        </div>
      </div>
    );
  }
});

export default Login;

