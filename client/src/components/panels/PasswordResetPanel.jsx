import React, { Component } from 'react';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';

class PasswordResetPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email : '',
      password : ''
    };

    this.emailDidChange = this.emailDidChange.bind(this);
    this.passwordDidChange = this.passwordDidChange.bind(this);

  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }

  componentDidUpdate(){

  }

  emailDidChange(event){
    this.setState({ email: event.target.value });
  }
  passwordDidChange(event){
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <div className="PasswordResetPanel panel">
        <h1 className="title">{ 'Password Reset' }</h1>
        <VisavInput label="Email" valueDidChange={ this.emailDidChange } />
        <ImageButton text='Send' />
      </div>
    );
  }
};

export default PasswordResetPanel;
