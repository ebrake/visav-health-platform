import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import AccountActions from '../../alt/actions/AccountActions';
import RoutingStore from '../../alt/stores/RoutingStore';
import FullscreenAlert from '../misc/FullscreenAlert';
import PasswordResetPanel from '../panels/PasswordResetPanel';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showForgotPasswordPopup: false,
      user: undefined,
      afterLoginRoute: RoutingStore.getAfterLoginRoute()
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.getNextRoute = this.getNextRoute.bind(this);
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

  getNextRoute() {
    var nextState = this.state.afterLoginRoute;
    var nextRoute = '/me';

    if (nextState.path) {
      nextRoute = nextState.path + nextState.query;
    }

    return nextRoute;
  }

  handleLogin() {
    AccountActions.loginUser({
      email: this.state.email,
      password: this.state.password
    })
    .then(function(response){
      if (response && response.data && response.data.status === 'success') {
        this.props.router.push(this.getNextRoute());
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
        <FullscreenAlert active={this.state.showForgotPasswordPopup} onClickOutside={this.handleCloseForgotPassword}  content={<PasswordResetPanel />} />
        <div className="login-panel panel">
          <h1 className="title">Login</h1>
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } onKeyUp={ this.handleKeyPressed } />
          <ImageButton text="Login" onClick={this.handleLogin} />
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
