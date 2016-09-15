import React, { Component } from 'react';
import { withRouter } from 'react-router'
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
    this.goToLogin = this.goToLogin.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.createUser = this.createUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  } 

  goToLogin() {
    this.props.router.push('/login');
  }

  createUser() {
    if (!this.state.email) return console.log('No email!'); //trigger email validation message
    if (!this.state.password) return console.log('No password!'); //trigger password validation message
    let self = this;
    fetch(
      process.env.API_ROOT + 'api/People/createUser', 
      {
        method: 'POST', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password }) 
      }
    ).then(function(response){
      return response.json();
    })
    .then(function(response){
      if (response.data.user && response.data.user.status != 'error') {
        console.log('User creation successful! Logging in...');
        self.login();
      } else {
        //trigger "duplicate email" or whatever error message is in data.user.type
        console.log("Error creating account:");
        console.dir(data);
      }
    })
    .catch(function(err){
      console.log('Error:');
      console.dir(err);
    })
  }

  login() {
    var self = this;

    fetch(process.env.API_ROOT + 'api/People/loginUser', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(response => response.json())
    .then(function(response){
      AccountActions.loginUser(response.data);

      //redirect
      console.log('Login successful! Redirecting...');
      self.props.router.push('/me');
    })
    .catch(function(err){
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error:');
      console.dir(err);
    })
  }

  handleChange(field) {
    return function(event) {
      var state = {};
      state[field] = event.target.value;
      this.setState(state);
    }.bind(this);
  }

  keyPressed(ev) {
    if (ev.keyCode == 13) {
      ev.preventDefault();
      this.createUser();
    }
  }

  render() {
    return (
      <div className="page">
        <div className="accounts-flex-padding"></div>
        <div className="content-container accounts-container">
          <div className="accounts-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          </div>
          <div className="accounts-input-wrapper">
            <input placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} onKeyUp={this.keyPressed} />
          </div>
          <button className="accounts-button" onClick={this.createUser}><span>Create User</span></button>
          <span className="accounts-link" onClick={this.goToLogin}>{"Have an account? Log in"}</span>
        </div>
        <div className="accounts-flex-padding"></div>
      </div>
    );
  }
};

Signup.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

Signup = withRouter(Signup);

export default Signup;

