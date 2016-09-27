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
      InviteNavItem = (<NavItem imgSrc="circle.png" path="/invite" />);
    }

    return (
      <div className="LeftNav nav flex-column">
        <div className="vertical-nav" id="left-nav">
          <NavItem imgSrc="circle.png" path="/me" />
          <NavItem imgSrc="circle.png" path="/people" />
          {InviteNavItem}
          <NavItem imgSrc="circle.png" path="/logout" />
        </div>
      </div>
    );
  }
};

export default LeftNav;
