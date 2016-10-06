import React, { Component } from 'react';
import { withRouter } from 'react-router/es';
import AccountStore from '../../alt/stores/AccountStore';
import MainHeader from '../headers/MainHeader';
import LeftNav from '../headers/LeftNav';
import Roles from '../utils/Roles';

function userIsAuthenticatedForComponent(user, ComposedComponent) {
  if (!ComposedComponent) {
    return true;
  }

  if (!user || !user.role || !user.role.name) {
    return false;
  }

  let roles = Roles.getRoles();
  if (ComposedComponent.isAllowed)
    roles = ComposedComponent.isAllowed;

  return roles.indexOf(user.role.name) >= 0;
}

export default (ComposedComponent) => {
  class AuthenticatedPage extends Component {
    constructor(props) {
      super(props);

      let user = AccountStore.getUser();

      if (!userIsAuthenticatedForComponent(user, ComposedComponent)) {
        console.log("User is unauthenticated");
        console.dir(user);
        this.props.router.goBack();
      }

      this.state = {
        user: user
      };

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
        <MainHeader {...this.props} />
        <div className="flex-row body-container">
          <LeftNav {...this.props} />
          <ComposedComponent
            {...this.props}
            user={this.state.user} />
        </div>
      </div>
      );
    }
  }

  AuthenticatedPage.propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  }

  return withRouter(AuthenticatedPage);
};
