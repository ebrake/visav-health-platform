import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import AccountActions from '../../alt/actions/AccountActions';
import UIActions from '../../alt/actions/UIActions';
import FullscreenAlertListener from '../misc/FullscreenAlertListener';

import FullscreenAlert from '../misc/FullscreenAlert';
import PasswordResetPanel from '../panels/PasswordResetPanel';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showForgotPasswordPopup: false,
      password: '',
      user: undefined
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.launchForgotPassword = this.launchForgotPassword.bind(this);
    this.closeForgotPassword = this.closeForgotPassword.bind(this);

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

  launchForgotPassword(){
    var popup = <FullscreenAlert active={ true } onClickOutside={this.closeForgotPassword}  content={<PasswordResetPanel />} />
    this.setState({
      forgotPasswordPopup: popup
    });
    UIActions.displayAlert(popup);

  }

  closeForgotPassword(){
    UIActions.removeAlert(this.state.forgotPasswordPopup);
  }

  render() {

    return (
      <div className="page">
        <FullscreenAlertListener />
        <div className="login-panel panel">
          <h1 className="title">Login</h1>
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } onKeyUp={ this.keyPressed } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } onKeyUp={ this.keyPressed } />
          <ImageButton text="Login" onClick={this.login} />
          <span className="text-link" onClick={this.goToSignup}>{"Don't have an account? Sign up"}</span>
          <span className="text-link" onClick={this.launchForgotPassword}>{"Forgot your password?"}</span>
        </div>
      </div>
    );
  }
};

Login.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(Login);
