import React from 'react';
import { withRouter } from 'react-router/es'
import AccountActions from '../../alt/actions/AccountActions';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organizationName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    };

    this.login = this.login.bind(this);
    this.handleGotoLogin = this.handleGotoLogin.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  } 

  handleGotoLogin() {
    this.props.router.push('/login');
  }

  handleCreateUser() {
    AccountActions.createUser({
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      organizationName: this.state.organizationName
    })
    .then(function(response){
      if (response && response.data && response.data.status === 'success') {
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
      if (response && response.data && response.data.status === 'success') {
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

  handleKeyPressed(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.handleCreateUser();
    }
  }

  render() {
    return (
      <div className="page">
        <div className="signup-panel panel">
          <h1 className="title">Sign Up</h1>
          <VisavInput label="Organization Name" valueDidChange={ this.handleChange('organizationName') } />
          <VisavInput label="Email" valueDidChange={ this.handleChange('email') } />
          <VisavInput label="Password" valueDidChange={ this.handleChange('password') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="First Name" valueDidChange={ this.handleChange('firstName') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="Last Name" valueDidChange={ this.handleChange('lastName') } onKeyUp={ this.handleKeyPressed } />
          <ImageButton text="Sign Up" onClick={ this.handleCreateUser } />
          <span className="text-link" onClick={ this.handleGotoLogin }>{"Have an account? Log in"}</span>
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

export default withRouter(Signup);
