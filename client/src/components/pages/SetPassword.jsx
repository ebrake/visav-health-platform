import React from 'react';
import { withRouter } from 'react-router/es'
import SetPasswordPanel from '../panels/SetPasswordPanel';

class SetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authToken: this.props.location.query.access_token
    };

    if (this.props.location.query.access_token) {
      localStorage.setItem('accessToken', this.props.location.query.access_token);
    }

    this.goToLogout = this.goToLogout.bind(this);
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

