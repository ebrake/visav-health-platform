import React, { Component } from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import Dropdown from 'react-dropdown';
import Roles from '../utils/Roles';

const roles = Roles.getRoles();

class InviteUsers extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      role: undefined
    };

    this.inviteUser = this.inviteUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onRoleSelected = this.onRoleSelected.bind(this);
  }

  handleChange(field) {
    return function(event) {
      var state = {};
      state[field] = event.target.value;
      this.setState(state);
    }.bind(this);
  }

  inviteUser() {
    fetch(process.env.API_ROOT + 'api/people/invite', {
      method: 'POST', 
      headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: this.state.email, role: this.state.role.value })
    })
    .then(response => response.json())
    .then(response => {
      console.log('Maybe succeeded at inviting user:');
      console.dir(response);
    })
    .catch((err) => {
      console.log('Error inviting new user:');
      console.dir(err);
    })
  }

  onRoleSelected(selectedRole) {
    this.setState({
      role: selectedRole
    })
  }

  render() {
    return (
      <div className="InviteUsers content-container">
        <div className="InviteUsersPanel panel">
          <h1 className="title">Invite a new User</h1>
          <span className="description">Use the menu below to invite a new user to your organization.</span>
          <div className="text-input-wrapper">
            <input placeholder="Email" value={this.state.email} onChange={this.handleChange('email')} />
          </div>
          <Dropdown options={roles} onChange={this.onRoleSelected} value={this.state.role} placeholder="Select a role..." />
          <ImageButton className="invite-button" text="Invite new user" onClick={this.inviteUser} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(InviteUsers);