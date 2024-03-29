import React from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import VISAV from '../misc/VISAV';
import VisavIcon from '../misc/VisavIcon';

class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: AccountStore.getUser()
    };
  }

  render () {
    return (
      <div className="MainHeader header">
        <div className="header-row">
          <VISAV />
          <div id="header-person-container">
            <span id="header-person-text">{this.state.user ? this.state.user.firstName+' '+this.state.user.lastName : 'Account'}</span>
            <VisavIcon id="header-person-visav-icon" type="user" />
          </div>
        </div>
      </div>
    );
  }
};

export default MainHeader;
