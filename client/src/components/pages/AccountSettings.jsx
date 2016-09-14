import React, { Component } from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import Dropdown from 'react-dropdown';

class AccountSettings extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: ''
    };

    this.update = this.update.bind(this);
    this.logState = this.logState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return function(event) {
      var state = {};
      state[field] = event.target.value;
      this.setState(state);
    }.bind(this);
  }

  logState() {
    console.log(this.state);
  }

  update() {
    fetch(
      process.env.API_ROOT + 'api/People/update-user',
      {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({ 
          firstName: this.state.firstName,
          lastName: this.state.lastName
        })
      }
    )
    .then(response => response.json())
    .then(response => {
      console.log('Updated?');
      console.dir(response);
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
          <div className="text-input-wrapper">
            <input placeholder="First Name" value={this.state.firstName} onChange={this.handleChange('firstName')} />
          </div>
          <div className="text-input-wrapper">
            <input placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange('lastName')} />
          </div>
          <ImageButton className="accounts-button" text="Save" onClick={this.update} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(AccountSettings);
