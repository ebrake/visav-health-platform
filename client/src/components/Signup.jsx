import React, { Component } from 'react';

var Login = React.createClass({
  mixins: null,
  cursors: {
    list: ['list']
  },
  createUser: function() {
    if (!this.state.email) return console.log('No email!');
    if (!this.state.password) return console.log('No password!');

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
      console.dir(data);
    })
    .catch(function(err){
      console.log('Error:');
      console.dir(err);
    })
  },
  getInitialState: function() {
    return {
      email: '',
      password: ''
    };
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
          <input className="account-text-field" placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          <input className="account-text-field" placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} />
          <button className="fb-login-button" onClick={this.createUser}><span>Create User</span></button>
        </div>
      </div>
    );
  }
});

export default Login;

