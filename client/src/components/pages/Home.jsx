import React from 'react';
import AccountStore from '../../alt/stores/AccountStore';
import FullscreenAlert from '../misc/FullscreenAlert';
import AuthenticatedPage from './AuthenticatedPage';

class Home extends React.Component {
  constructor(props) {
    super(props);

    let user = AccountStore.getUser();

    console.dir(user);

    this.state = {
      user: user
    };
  }

  componentDidMount(){

  }

  render() {
    return (
      <div className="Home content-container">
        <h1 className="title">{this.state.user.role.name}</h1>
        <div className="flex-row">

        </div>
      </div>
    );
  }
}

//eslint-disable-next-line
export default AuthenticatedPage(Home);
