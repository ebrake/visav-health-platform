import React, { Component } from 'react';
import NavItem from '../list-items/NavItem'
import AccountStore from '../../alt/stores/AccountStore';

class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: AccountStore.getUser()
    };
  }

  render () {
    let InviteNavItem = null;
    if (["owner", "admin"].indexOf(this.state.user.role.name) >= 0) {
      InviteNavItem = (<NavItem title="Invite" />);
    }

    return (
      <div className="LeftNav nav panel flex-column">
        <div className="vertical-nav" id="left-nav">
          <NavItem title="Home" path="/me" />
          <NavItem title="People" />
          {InviteNavItem}
          <NavItem title="Logout" />
        </div>
      </div>
    );
  }
};

export default LeftNav;
