import React, { Component } from 'react';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import { withRouter } from 'react-router';
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }  

  login() {
    fetch(process.env.API_ROOT + 'api/people/login', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(response => response.json())
    .then( data => {
      AccountActions.loginUser(data);

      //redirect
      console.log('Login successful! Redirecting...');
      this.props.router.push('/me');
    })
    .catch((err) => {
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error logging in:');
      console.dir(err);
    })
  }

  logout() {
    this.props.router.push('/logout');
  }

  handleChange(key) {
    return function(event) {
      var state = {};
      state[key] = event.target.value;
      this.setState(state);
    }.bind(this);
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
        <div className="content-container accounts-container">
          <div className="accounts-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          </div>
          <div className = "accounts-input-wrapper">
            <input placeholder="Password" value={this.state.password} onChange={this.handleChange('password')} />
          </div>
          <button className="accounts-button" onClick={this.login}>
            <span>Login</span>
          </button>
          <button className="accounts-button" onClick={this.logout}>
            <span>Logout</span>
          </button>
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
