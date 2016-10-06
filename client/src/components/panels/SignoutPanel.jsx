import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ImageButton from '../buttons/ImageButton';

class SignoutPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.gotoLogout = this.gotoLogout.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    
  }

  gotoLogout() {
    this.props.router.push('/logout');
  }

  handleCancel(event) {
    this.props.onCancel(event);
  }

  render() {
    return (
      <div className="SignoutPanel panel">
        <span className="description">Are you sure you would like to sign out?</span>
        <ImageButton text="Cancel" onClick={ this.handleCancel } />
        <ImageButton className="destructive" text="Sign out" onClick={ this.gotoLogout } />
      </div>
    );
  }
};

SignoutPanel.propTypes = {
  onCancel: React.PropTypes.func,
  person: React.PropTypes.object,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(SignoutPanel);
