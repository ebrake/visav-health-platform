import React, { Component } from 'react';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import { hashHistory } from 'react-router';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

  }  

  login() {
    fetch(process.env.API_ROOT + 'api/people/login', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, password: this.state.password })
    }).then(function(response){
      return response.json();
    })
    .then(function(data){
      AccountActions.loginUser(data);

      //redirect
      console.log('Login successful! Redirecting...');
      hashHistory.push('/me');
    })
    .catch(function(err){
      //should add validation messages here, error will be one of 'email', 'password', 'login' (login meaning general issue)
      console.log('Error:');
      console.dir(err);
    })
  }
  logout() {
    hashHistory.push('/logout');
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
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <div className="App-body">
          <input className="account-text-field" placeholder="Email" value={this.state.email} 
            onChange={this.handleChange('email')} />

          <input className="account-text-field" placeholder="Password" value={this.state.password} 
            onChange={this.handleChange('password')} />

          <button className="fb-login-button" onClick={this.login}>
            <span>Login</span>
          </button>

          <button className="fb-login-button" onClick={this.logout}>
            <span>Logout</span>
          </button>

          {/*<FacebookLogin  cssClass="fb-login-button" appId="1641537292841144" autoLoad={false} fields="name,email,picture"  
                          callback={console.log} version="2.7" />*/}
        </div>
      </div>
    );
  }
};

export default Login;

