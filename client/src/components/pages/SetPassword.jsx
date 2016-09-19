import React, { Component } from 'react';
import { withRouter } from 'react-router'
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import SetPasswordPanel from '../panels/SetPasswordPanel';

class SetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.goToLogout = this.goToLogout.bind(this);
    console.dir(props);
    this.state = {
      authToken: this.props.location.query.access_token
    };
    if (this.props.location.query.access_token) {
      console.log('setting access token');
      localStorage.setItem('accessToken', this.props.location.query.access_token);
    }
  } 

  goToLogout() {
    this.props.router.push('/logout');
  }

  render() {
    return (
      <div className="page">
        <SetPasswordPanel didSetPassword={ this.goToLogout }/>
      </div>
    );
  }
};

SetPassword.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

SetPassword = withRouter(SetPassword);

export default SetPassword;

