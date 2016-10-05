import React from 'react';
import AccountActions from '../../alt/actions/AccountActions';
import AccountStore from '../../alt/stores/AccountStore';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import VisavDropdown from '../inputs/VisavDropdown';
import Roles from '../utils/Roles';
import VisavInput from '../inputs/VisavInput';

class Invite extends React.Component {
  
  constructor(props) {
    super(props);

    let user = AccountStore.getUser();

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      role: undefined,
      //format assignable roles for Dropdown
      roles: Roles.getAssignableRoles(user).map(function(role){
        return { value: role, label: role.charAt(0).toUpperCase()+role.slice(1) }
      })
    };

    this.handleInviteUser = this.handleInviteUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRoleSelected = this.handleRoleSelected.bind(this);
  }

  handleChange(field) {
    return function(event) {
      var state = {};
      state[field] = event.target.value;
      this.setState(state);
    }.bind(this);
  }

  handleInviteUser() {
    AccountActions.inviteUser({
      email: this.state.email,
      role: this.state.role,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    })
    .then(function(response){
      console.log("Potentially invited user:");
      console.dir(response);
    })
  }

  handleRoleSelected(selectedRole) {
    this.setState({
      role: selectedRole
    })
  }

  render() {
    return (
      <div className="Invite content-container">
        <div className="InvitePanel panel">
          <h1 className="title">Invite a new User</h1>
          <VisavInput label="Email" value={this.state.email} valueDidChange={this.handleChange('email')} />
          <VisavInput label="First Name" value={this.state.firstName} valueDidChange={this.handleChange('firstName')} />
          <VisavInput label="Last Name" value={this.state.lastName} valueDidChange={this.handleChange('lastName')} />
          <VisavDropdown options={this.state.roles} onChange={this.handleRoleSelected} value={this.state.role} placeholder="Select a role..." />
          <ImageButton className="invite-button" text="Invite new user" onClick={this.handleInviteUser} />
        </div>
      </div>
    );
  }
}

Invite.isAllowed = ['owner', 'admin'];

//eslint-disable-next-line
export default AuthenticatedPage(Invite);
