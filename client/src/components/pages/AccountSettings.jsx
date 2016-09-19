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

    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return function(event) {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    }.bind(this)
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
      <div className="InviteUsers content-container">
        <div className="AccountSettings panel">
          <h1 className="title">Account Settings</h1>
          <VisavInput className="visav-text-field" label="First Name" value={ this.state.firstName } valueDidChange={ this.handleChange('firstName') } />
          <VisavInput className="visav-text-field" label="Last Name" value={ this.state.lastName } valueDidChange={ this.handleChange('lastName') } />
          <VisavInput className="visav-text-field" label="Phone Number" value={ this.state.phone } valueDidChange={ this.handleChange('phone') } />
          <ImageButton className="accounts-button" text="Save" onClick={this.update} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(AccountSettings);
