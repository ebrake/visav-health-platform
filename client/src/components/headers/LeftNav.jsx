import React, { Component } from 'react';
import NavIcon from '../lists/NavIcon';
import AccountStore from '../../alt/stores/AccountStore';

class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: AccountStore.getUser()
    };
  }

  render () {
    let path = this.props.location.pathname;
    
    let InviteNavIcon = null;
    if (["owner", "admin"].indexOf(this.state.user.role.name) >= 0) {
      InviteNavIcon = (<NavIcon type="invite" path="/invite" selected={ path === "/invite" } />);
    }

    return (
      <div className="LeftNav nav flex-column">
        <div className="vertical-nav" id="left-nav">
          <NavIcon type="telesession" path="/telesession" selected={ path === "/telesession" } />
          <NavIcon type="organization" path="/people" selected={ path === "/people" } />
          {InviteNavIcon}
          <NavIcon type="logout" path="/logout" selected={ path === "/logout" } />
        </div>
      </div>
    );
  }
};

export default LeftNav;
