import React, { Component } from 'react';
import NavItem from '../lists/NavItem'
import AccountStore from '../../alt/stores/AccountStore';
import VISAV from '../misc/VISAV';

class MainHeader extends React.Component {
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
      <div className="MainHeader header">
        <div className="header-row">
          <VISAV />
          <ul className="horizontal-nav nav">
            <NavItem title={this.state.user ? this.state.user.firstName+' '+this.state.user.lastName : 'Account' } path="/account" />
          </ul>
        </div>
      </div>
    );
  }
};

export default MainHeader;
