import React, { Component } from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import MainHeader from '../headers/MainHeader';
import Roles from '../utils/Roles';

function determineAllowedRoles(arrayOfAllowedRoles) {
  if (!arrayOfAllowedRoles || arrayOfAllowedRoles.length == 0) 
    return Roles.getRoles();

  return arrayOfAllowedRoles;
}

export default (ComposedComponent) => {
  class AuthenticatedPage extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        user: AccountStore.getState() ? AccountStore.getState().user : undefined
      }

      this.accountChanged = this.accountChanged.bind(this);
    }

    accountChanged(accountStore) {
      this.setState({
        user: accountStore.user
      })
    }

    componentDidMount(){
      AccountStore.listen(this.accountChanged);
    }

    componentWillUnmount(){
      AccountStore.unlisten(this.accountChanged);
    }

    render() {
      return (
      <div className="page">
        <MainHeader />
        <ComposedComponent
          {...this.props}
          user={this.state.user} />
      </div>
      );
    }
  }

  AuthenticatedPage.isAllowed = determineAllowedRoles(ComposedComponent.isAllowed);

  return AuthenticatedPage;
};
