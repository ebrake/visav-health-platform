import React, { Component } from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import Dropdown from 'react-dropdown';
import AccountActions from '../../alt/actions/AccountActions';
import VisavInput from '../inputs/VisavInput';

class AccountSettings extends React.Component {
  
  constructor(props) {
    super(props);

    //TODO: set this to the current values
    this.state = {
      firstName: '',
      lastName: '',
      phone: ''
    };

    this.update = this.update.bind(this);
    this.logState = this.logState.bind(this);
    this.firstNameDidChange = this.firstNameDidChange.bind(this);
    this.lastNameDidChange = this.lastNameDidChange.bind(this);
    this.phoneDidChange = this.phoneDidChange.bind(this);

  }

  firstNameDidChange(event) {
    this.setState({ firstName: event.target.value });
  }

  lastNameDidChange(event) {
    this.setState({ lastName: event.target.value });
  }

  phoneDidChange(event) {
    this.setState({ phone: event.target.value });
  }

  logState() {
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    //update user in here
  }

  update() {
    fetch(
      process.env.API_ROOT + 'api/People/update-user',
      {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({ 
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phone: this.state.phone
        })
      }
    )
    .then(response => response.json())
    .then(response => {
      if (response.data && response.data.status == 'success') {
        AccountActions.updateUser(response.data.user);
      }
    })
    .catch(err => {
      console.log('Error updating:');
      console.dir(err);
    })
  }

  render() {
    return (
      <div className="AccountSettings content-container">
        <div className="AccountSettingsPanel panel">
          <h1 className="title">Account Settings</h1>
          <VisavInput className="visav-text-field" label="First Name" valueDidChange={ this.firstNameDidChange } />
          <VisavInput className="visav-text-field" label="Last Name" valueDidChange={ this.lastNameDidChange } />
          <VisavInput className="visav-text-field" label="Phone Number" valueDidChange={ this.phoneDidChange } />
          <ImageButton className="accounts-button" text="Save" onClick={this.update} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(AccountSettings);
