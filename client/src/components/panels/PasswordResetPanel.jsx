import React, { Component } from 'react';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';
import AccountActions from '../../alt/actions/AccountActions';

class PasswordResetPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email : '',
    };

    this.emailDidChange = this.emailDidChange.bind(this);
    this.attemptPasswordReset = this.attemptPasswordReset.bind(this);

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

  attemptPasswordReset(){
    AccountActions.requestPasswordReset({ email: this.state.email })
    .then(function(response){
      if (response && response.data)
        console.log(response.data.message);
    });
  }

  render() {
    return (
      <div className="PasswordResetPanel panel">
        <h1 className="title">{ 'Password Reset' }</h1>
        <VisavInput label="Email" valueDidChange={ this.emailDidChange } />
        <ImageButton text='Send' onClick={ this.attemptPasswordReset.bind(this) } />
      </div>
    );
  }
};

export default PasswordResetPanel;
