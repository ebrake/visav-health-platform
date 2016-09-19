import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AccountActions from '../../alt/actions/AccountActions';
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
    this.setState({showForgotPasswordPopup: true});
  }

  closeForgotPassword(){
    this.setState({showForgotPasswordPopup: false});
  }

  render() {

    return (
      <div className="page">
        <FullscreenAlert active={this.state.showForgotPasswordPopup} onClickOutside={this.closeForgotPassword}  content={<PasswordResetPanel />} />
        <div className="login-panel panel">
          <h1 className="title">Login</h1>
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } />
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

Login = withRouter(Login);

export default Login;
