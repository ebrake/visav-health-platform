import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import AccountActions from '../../alt/actions/AccountActions';
import FullscreenAlert from '../misc/FullscreenAlert';
import PasswordResetPanel from '../panels/PasswordResetPanel';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';
import FormErrorLabel from '../misc/FormErrorLabel';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showForgotPasswordPopup: false,
      user: undefined,
      formErrorMessage: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.handleGotoSignup = this.handleGotoSignup.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleCloseForgotPassword = this.handleCloseForgotPassword.bind(this);
  }  

  handleGotoSignup() {
    this.props.router.push('/signup');
  }

  handleLogin() {
    var self = this;
    AccountActions.loginUser({
      email: this.state.email,
      password: this.state.password
    })
    .then(function(response){
      if (response && response.data && response.data.status === 'success') {
        this.props.router.push ('/me');
        self.setState({ formErrorMessage:'' });
      } else {
        //validation messages
        self.setState({ formErrorMessage: 'Error: '+response.data.message });
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

  handleKeyPressed(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.handleLogin();
    }
  }

  handleForgotPassword(){
    this.setState({showForgotPasswordPopup: true});
  }

  handleCloseForgotPassword(){
    this.setState({showForgotPasswordPopup: false});
  }

  render() {

    return (
      <div className="page">
        <FullscreenAlert active={this.state.showForgotPasswordPopup} onClickOutside={this.handleCloseForgotPassword} content={<PasswordResetPanel />} />
          <div className="login-panel panel">
          <h1 className="title">Login</h1>
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } onKeyUp={ this.handleKeyPressed } />
          <ImageButton text="Login" onClick={this.handleLogin} />
          <FormErrorLabel text={this.state.formErrorMessage} />
          <span className="text-link" onClick={this.handleGotoSignup}>{"Don't have an account? Sign up"}</span>
          <span className="text-link" onClick={this.handleForgotPassword}>{"Forgot your password?"}</span>
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
