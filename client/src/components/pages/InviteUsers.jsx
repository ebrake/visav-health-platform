import React, { Component } from 'react';
import AccountActions from '../../alt/actions/AccountActions';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import Dropdown from 'react-dropdown';
import Roles from '../utils/Roles';
import VisavInput from '../inputs/VisavInput';

const roles = Roles.getAssignableRoles().map(function(role){
  return { value: role, label: role.charAt(0).toUpperCase()+role.slice(1) }
});

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
    AccountActions.inviteUser({
      email: this.state.email,
      role: this.state.role
    })
    .then(function(response){
      console.log("Potentially invited user:");
      console.dir(response);
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
          <VisavInput label="Email" value={this.state.email} valueDidChange={this.handleChange('email')} />
          <div className="dropdown-container">
            <Dropdown options={roles} onChange={this.onRoleSelected} value={this.state.role} placeholder="Select a role..." />
          </div>
          <ImageButton className="invite-button" text="Invite new user" onClick={this.inviteUser} />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(InviteUsers);
