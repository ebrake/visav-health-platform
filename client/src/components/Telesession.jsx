import React, { Component } from 'react';

var Telesession = React.createClass({

  getInitialState: function() {
    return {
      createSessionResponse: '',
    }
  },

  createSession: function() {

    fetch(
      'http://localhost:4000/api/Telesessions/createSession', 
      {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) 
      }
    ).then(responseObject => responseObject.json())
    .then(response => {
      this.setState({
        createSessionResponse: JSON.stringify(response)
      });
      console.log(response.telesession);
    })
    .catch((err) => {
      this.setState({
        createSessionResponse: JSON.stringify(err)
      });
      console.error(err);
    });
  },

  render: function () {
    return (
      <p>
        <button onClick={this.createSession}><h1>Create Session</h1></button>
        <p>{this.state.createSessionResponse}</p>
      </p>
    );
  }
});

export default Telesession;
