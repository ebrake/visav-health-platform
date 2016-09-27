import React, { Component } from 'react';
import NavItem from '../list-items/NavItem'
import AccountStore from '../../alt/stores/AccountStore';

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
          <h1 className="title">Visav</h1>
          <ul className="horizontal-nav nav">
            <NavItem title="Account" />
          </ul>
        </div>
      </div>
    );
  }
};

export default MainHeader;
