import React, { Component } from 'react';
import { hashHistory } from 'react-router'
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.login = this.login.bind(this);
    this.createUser = this.createUser.bind(this);
    this.handleChange = this.handleChange.bind(this);

  } 

  createUser() {
    if (!this.state.email) return console.log('No email!');
    if (!this.state.password) return console.log('No password!');
    let self = this;
    fetch(
      'http://localhost:4000/user/create', 
      {
        method: 'POST', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password }) 
      }
    ).then(function(response){
      return response.json();
    })
    .then(function(data){
      if (data.user) {
        console.log('User creation successful! Logging in...');
        self.login();
      }
    })
    .catch(function(err){
      console.log('Error:');
      console.dir(err);
    })
  }

  login() {
    fetch('http://localhost:4000/user/login', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(function(response){
      return response.json();
    })
    .then(function(data){
      AccountActions.loginUser(data);

      //redirect
      console.log('Login successful! Redirecting...');
      hashHistory.push('/me');
    })
    .catch(function(err){
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error:');
      console.dir(err);
    })
  }

  handleChange(key) {
    return function(event) {
      var state = {};
      state[key] = event.target.value;
      this.setState(state);
    }.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <input className="account-text-field" placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          <input className="account-text-field" placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} />
          <button className="fb-login-button" onClick={this.createUser}><span>Create User</span></button>
        </div>
      </div>
    );
  }
};

export default Signup;

