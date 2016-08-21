import React, { Component } from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import MainHeader from '../headers/MainHeader';

export default (ComposedComponent) => {
  return class AuthenticatedPage extends React.Component {
    constructor(props) {
      super(props);

    }

    render() {
      return (
      <div className="App">
        <MainHeader />
        <ComposedComponent
          {...this.props} />
      </div>
      );
    }
  }
};
