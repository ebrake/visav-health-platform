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
      InviteNavItem = (<NavItem imgSrc="circle.png" path="/invite" className={path=="/invite" ? "selected" : ""} />);
    }

    let path = this.props.location.pathname;

    return (
      <div className="LeftNav nav flex-column">
        <div className="vertical-nav" id="left-nav">
          <NavItem imgSrc="circle.png" path="/telesession" className={path=="/telesession" ? "selected" : ""} />
          <NavItem imgSrc="circle.png" path="/people" className={path=="/people" ? "selected" : ""} />
          {InviteNavItem}
          <NavItem imgSrc="logout.png" path="/logout" className={path=="/logout" ? "selected" : ""} />
        </div>
      </div>
    );
  }
};

export default LeftNav;
