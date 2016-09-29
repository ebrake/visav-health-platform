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
      InviteNavIcon = (<NavIcon type="invite" path="/invite" className={path=="/invite" ? "selected" : ""} />);
    }

    return (
      <div className="LeftNav nav flex-column">
        <div className="vertical-nav" id="left-nav">
          <NavIcon type="telesession" path="/telesession" className={path=="/telesession" ? "selected" : ""} />
          <NavIcon type="organization" path="/people" className={path=="/people" ? "selected" : ""} />
          {InviteNavIcon}
          <NavIcon type="logout" path="/logout" className={path=="/logout" ? "selected" : ""} />
        </div>
      </div>
    );
  }
};

export default LeftNav;
