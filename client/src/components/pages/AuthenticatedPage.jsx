import React, { Component } from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import MainHeader from '../headers/MainHeader';

export default (ComposedComponent) => {
  return class AuthenticatedPage extends React.Component {
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
      <div className="App">
        <MainHeader />
        <ComposedComponent
          {...this.props}
          user={this.state.user} />
      </div>
      );
    }
  }
};
