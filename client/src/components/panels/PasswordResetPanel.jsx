import React, { Component } from 'react';

class PasswordResetPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };


  }

  componentDidMount(){
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  componentDidUpdate(){

  }

  render() {
    return (
      <div className="PasswordResetPanel panel">
        <h1 className="title">{ 'Password Reset' }</h1>
        
      </div>
    );
  }
};

export default PasswordResetPanel;
