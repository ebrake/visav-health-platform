import React, { Component } from 'react';
import { withRouter } from 'react-router'
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organizationName: '',
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
    AccountActions.createUser({
      email: this.state.email,
      password: this.state.password,
      organizationName: this.state.organizationName
    })
    .then(function(response){
      if (response && response.data && response.data.status == 'success') {
        console.log('User creation successful! Logging in...');
        console.dir(response);
        this.login();
      } else {
        //validation messages
      }
    }.bind(this))
  }

  login() {
    AccountActions.loginUser({
      email: this.state.email,
      password: this.state.password
    })
    .then(function(response){
      if (response && response.data && response.data.status == 'success') {
        this.props.router.push('/me');
      } else {
        //validation messages
      }
    }.bind(this))
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
        <div className="content-container accounts-container">
          <div className="text-input-wrapper">
            <input placeholder="Organization Name" value={this.state.organizationName} onChange={this.handleChange('organizationName')} />
          </div>
          <div className="text-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          </div>
          <div className="text-input-wrapper">
            <input placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} onKeyUp={this.keyPressed} />
          </div>
          <button className="accounts-button" onClick={this.createUser}><span>Sign Up</span></button>
          <span className="accounts-link" onClick={this.goToLogin}>{"Have an account? Log in"}</span>
        </div>
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

