import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
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
    fetch(process.env.API_ROOT + 'api/people/signin', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    })
    .then(response => response.json())
    .then(response => {
      if (response && response.data && response.data.status != 'error') {
        AccountActions.loginUser(response.data);

        console.log('Login successful! Redirecting...');
        this.props.router.push('/me');
      } else {
        //display validation messages
        console.log('Error logging in:');
        console.dir(response);
      }
    })
    .catch((err) => {
      console.log('Error logging in:');
      console.dir(err);
    })
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

  accountChanged(state) {
    console.log("Account Store changed:");
    console.dir(state);
  }

  componentDidMount(){
    AccountStore.listen(this.accountChanged);
  }

  componentWillUnmount(){
    AccountStore.unlisten(this.accountChanged);
  }

  render() {
    return (
      <div className="page">
        <div className="accounts-flex-padding"></div>
        <div className="content-container accounts-container">
          <div className="text-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} onKeyUp={this.keyPressed} />
          </div>
          <div className="text-input-wrapper">
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
