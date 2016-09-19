import React, { Component } from 'react';
import { withRouter } from 'react-router'
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';

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
        <div className="signup-panel panel">
          <h1 className="title">Signup</h1>
          <VisavInput label="Organization Name" onChange={this.handleChange('organizationName')} />
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } />
          <ImageButton text="Sign Up" onClick={this.createUser} />
          <span className="text-link" onClick={this.goToLogin}>{"Have an account? Log in"}</span>
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

