import React, { Component } from 'react';
import NavIcon from '../lists/NavIcon';
import AccountStore from '../../alt/stores/AccountStore';
import VisavIcon from '../misc/VisavIcon';
import FullscreenAlert from '../misc/FullscreenAlert';
import SignoutPanel from '../panels/SignoutPanel';

class LeftNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: AccountStore.getUser(),
      showSignoutPopup: false
    };

    this.showSignoutPopup = this.showSignoutPopup.bind(this);
    this.closeSignoutPopup = this.closeSignoutPopup.bind(this);
  }

  closeSignoutPopup(){
    this.setState({ showSignoutPopup: false });
  }

  showSignoutPopup(){
    this.setState({ showSignoutPopup: true });
  }

  render () {
    let path = this.props.location.pathname;
    
    let InviteNavIcon = null;
    if (["owner", "admin"].indexOf(this.state.user.role.name) >= 0) {
      InviteNavIcon = (<NavIcon type="invite" path="/invite" selected={ path === "/invite" } />);
    }

    return (
      <div className="LeftNav nav flex-column">
        <FullscreenAlert active={ this.state.showSignoutPopup } onClickOutside={ this.closeSignoutPopup }  content={<SignoutPanel onCancel={ this.closeSignoutPopup } />} />
        <div className="vertical-nav" id="left-nav">
          <NavIcon type="telesession" path="/telesession" selected={ path === "/telesession" || path === "/" } />
          <NavIcon type="organization" path="/people" selected={ path === "/people" } />
          {InviteNavIcon}
          <NavIcon type="account-settings" path="/account" selected={ path === "/account" } />
          <VisavIcon type="logout" onClick={ this.showSignoutPopup } selected={ path === "/logout" } />
        </div>
      </div>
    );
  }
};

export default LeftNav;
