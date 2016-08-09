import React, { Component } from 'react';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import { hashHistory } from 'react-router';

var Login = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  login: function() {
    fetch('http://localhost:4000/user/login', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(function(response){
      return response.json();
    })
    .then(function(data){
      localStorage.setItem('accessToken', data.token.id);
      AccountActions.loginUser(data.token.user);

      //redirect
      console.log('Login successful! Redirecting...');
      hashHistory.push('/me');
    })
    .catch(function(err){
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error:');
      console.dir(err);
    })
  },
  logout: function() {
    localStorage.removeItem('accessToken');
    AccountActions.logoutUser();
  },
  handleChange: function(key) {
    return function(event) {
      var state = {};
      state[key] = event.target.value;
      this.setState(state);
    }.bind(this);
  },
  accountChanged: function(state) {
    console.log("Account Store changed:");
    console.dir(state);
  },
  getInitialState: function() {
    return {
      email: '',
      password: ''
    }
  },
  componentDidMount: function(){
    AccountStore.listen(this.accountChanged);
  },
  componentWillUnmount: function(){
    AccountStore.unlisten(this.accountChanged);
  },
  render: function () {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <input className="account-text-field" placeholder="Email" value={this.state.email} 
            onChange={this.handleChange('email')} />

          <input className="account-text-field" placeholder="Password" value={this.state.password} 
            onChange={this.handleChange('password')} />

          <button className="fb-login-button" onClick={this.login}>
            <span>Login</span>
          </button>

          <button className="fb-login-button" onClick={this.logout}>
            <span>Logout</span>
          </button>

          {/*<FacebookLogin  cssClass="fb-login-button" appId="1641537292841144" autoLoad={false} fields="name,email,picture"  
                          callback={console.log} version="2.7" />*/}
        </div>
      </div>
    );
  }
});

export default Login;

