import React, { Component } from 'react';
import VisavInput from '../inputs/VisavInput';
import ImageButton from '../buttons/ImageButton';
import AccountActions from '../../alt/actions/AccountActions';
import FormErrorLabel from '../misc/FormErrorLabel';

class PasswordResetPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email : '',
      formErrorMessage: ''
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
    var self = this;
    AccountActions.requestPasswordReset({ email: this.state.email })
    .then(function(response){
      if (response && response.data && response.data.status === 'success') {
        console.log(response.data.message);
        self.setState({ formErrorMessage:'' });
      } else {
        //validation messages
        self.setState({ formErrorMessage: 'Error: '+response.data.message });
      }
    });
  }

  render() {
    return (
      <div className="PasswordResetPanel panel">
        <h1 className="title">{ 'Password Reset' }</h1>
        <VisavInput label="Email" valueDidChange={ this.emailDidChange } />
        <ImageButton className="password-reset-button" text='Send' onClick={ this.attemptPasswordReset.bind(this) } />
        <FormErrorLabel text={this.state.formErrorMessage} />
      </div>
    );
  }
};

export default PasswordResetPanel;
