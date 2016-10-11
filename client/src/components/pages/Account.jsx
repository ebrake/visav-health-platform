import React, { Component } from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import AccountActions from '../../alt/actions/AccountActions';
import AuthenticatedPage from './AuthenticatedPage';
import ImageButton from '../buttons/ImageButton';
import VisavInput from '../inputs/VisavInput';

class Account extends Component {
  
  constructor(props) {
    super(props);

    let user = AccountStore.getUser();

    //TODO: set this to the current values
    this.state = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    };

    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return function(event) {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    }.bind(this)
  }

  handleKeyPressed(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.handleUpdateUser();
    }
  }

  handleUpdateUser() {
    AccountActions.updateUser({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone
    })
    .then(function(response){
      if (response && response.data && response.data.status === 'success') {
        console.log('Successfully updated!');
      } else {
        console.log('Update failed!');
      }
    })
  }

  render() {
    return (
      <div className="Account content-container">
        <div className="AccountPanel panel">
          <h1 className="title">Account Settings</h1>
          <VisavInput label="First Name" value={ this.state.firstName } valueDidChange={ this.handleChange('firstName') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="Last Name" value={ this.state.lastName } valueDidChange={ this.handleChange('lastName') } onKeyUp={ this.handleKeyPressed } />
          <VisavInput label="Phone Number" value={ this.state.phone } valueDidChange={ this.handleChange('phone') } onKeyUp={ this.handleKeyPressed } />
          <ImageButton className="accounts-button" text="Save" onClick={this.handleUpdateUser} />
        </div>
      </div>
    );
  }
}

//eslint-disable-next-line
export default AuthenticatedPage(Account);
