import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      user: undefined
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }  

  goToSignup() {
    this.props.router.push('/signup');
  }

  login() {
    AccountActions.loginUser({
      email: this.state.email,
      password: this.state.password
    })
    .then(function(response){
      if (response && response.data && response.data.status == 'success') {
        this.props.router.push ('/me');
      } else {
        //validation messages
      }
    }.bind(this))
  }

  logout() {
    this.props.router.push('/logout');
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
      this.login();
    }
  }

  render() {
    return (
      <div className="page">
        <div className="accounts-flex-padding"></div>
        <div className="content-container accounts-container">
          <div className="accounts-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} onKeyUp={this.keyPressed} />
          </div>
          <div className="accounts-input-wrapper">
            <input placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} onKeyUp={this.keyPressed} />
          </div>
          <button className="accounts-button" onClick={this.login}>
            <span>Login</span>
          </button>
          <button className="accounts-button" onClick={this.logout}>
            <span>Logout</span>
          </button>
          <span className="accounts-link" onClick={this.goToSignup}>{"Don't have an account? Sign up"}</span>
        </div>
        <div className="accounts-flex-padding"></div>
      </div>
    );
  }
};

Login.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

Login = withRouter(Login);

export default Login;
