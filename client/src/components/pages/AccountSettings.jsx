import React, { Component } from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import AccountActions from '../../alt/actions/AccountActions';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import Dropdown from 'react-dropdown';
import VisavInput from '../inputs/VisavInput';

class AccountSettings extends React.Component {
  
  constructor(props) {
    super(props);

    let accountState = AccountStore.getState();
    let user = accountState.user;

    //TODO: set this to the current values
    this.state = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    };

    this.updateUser = this.updateUser.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return function(event) {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    }.bind(this)
  }

  keyPressed(ev) {
    if (ev.keyCode == 13) {
      ev.preventDefault();
      this.updateUser();
    }
  }

  updateUser() {
    AccountActions.updateUser({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone
    })
    .then(function(response){
      if (response && response.data && response.data.status == 'success') {
        console.log('Successfully updated!');
      } else {
        console.log('Update failed!');
      }
    })
  }

  render() {
    return (
      <div className="AccountSettings content-container">
        <div className="account-settings-panel panel">
          <h1 className="title">Account Settings</h1>
          <VisavInput label="First Name" value={ this.state.firstName } valueDidChange={ this.handleChange('firstName') } onKeyUp={ this.keyPressed } />
          <VisavInput label="Last Name" value={ this.state.lastName } valueDidChange={ this.handleChange('lastName') } onKeyUp={ this.keyPressed } />
          <VisavInput label="Phone Number" value={ this.state.phone } valueDidChange={ this.handleChange('phone') } onKeyUp={ this.keyPressed } />
          <ImageButton className="accounts-button" text="Save" onClick={this.updateUser} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(AccountSettings);
