import React, { Component } from 'react';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';
import AccountActions from '../../alt/actions/AccountActions';
class SetPasswordPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation : '',
      password : ''
    };

    this.passwordDidChange = this.passwordDidChange.bind(this);
    this.confirmationDidChange = this.confirmationDidChange.bind(this);
    this.setPassword = this.setPassword.bind(this);

  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }

  componentDidUpdate(){

  }

  passwordDidChange(event){
    this.setState({ password: event.target.value });
  }
  confirmationDidChange(event){
    this.setState({ confirmation: event.target.value });
  }

  setPassword(){
    AccountActions.setPassword({ password: this.state.password, confirmation: this.state.confirmation })
    .then(function( response ){
      if (response && response.data && response.data.status == 'success') {
        console.log('Password set successful!');
        this.props.didSetPassword(response);
      } else {
        //validation messages
        console.log('ERROR:');
        console.dir(response);
      }
    }.bind(this));
  }

  render() {
    return (
      <div className="SetPasswordPanel panel">
        <h1 className="title">{ 'Password Reset' }</h1>
        <VisavInput label="Password" valueDidChange={ this.passwordDidChange } />
        <VisavInput label="Confirmation" valueDidChange={ this.confirmationDidChange } />
        <ImageButton text='Set Password' onClick={ this.setPassword.bind(this) } />
      </div>
    );
  }
};

SetPasswordPanel.propTypes = {
  didSetPassword: React.PropTypes.func
}


export default SetPasswordPanel;
