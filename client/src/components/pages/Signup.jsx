import React, { Component } from 'react';
import { withRouter } from 'react-router'
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organization: '',
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
      process.env.API_ROOT + 'api/People/signup', 
      {
        method: 'POST', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organization: this.state.organization, 
          email: this.state.email, 
          password: this.state.password 
        })
      }
    )
    .then(response => response.json())
    .then(response => {
      if (response && response.data && response.data.status != 'error') {
        console.log('User creation successful! Logging in...');
        console.dir(response);
        self.login();
      } else {
        //trigger "duplicate email" or whatever error message is in data.user.type
        console.log("Error creating account:");
        console.dir(response);
      }
    })
    .catch(err => {
      console.log('Error:');
      console.dir(err);
    })
  }

  login() {
    fetch(process.env.API_ROOT + 'api/people/signin', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    })
    .then(response => response.json())
    .then(response => {
      AccountActions.loginUser(response.data);

      console.log('Login successful! Redirecting...');
      this.props.router.push('/me');
    })
    .catch(err => {
      console.log('Error logging in:');
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
            <input placeholder="Organization Name" value={this.state.organization} onChange={this.handleChange('organization')} />
          </div>
          <div className="accounts-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          </div>
          <div className="accounts-input-wrapper">
            <input placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} onKeyUp={this.keyPressed} />
          </div>
          <button className="accounts-button" onClick={this.createUser}><span>Sign Up</span></button>
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

