import React, { Component } from 'react';

const createSession = (arg) => {
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
  )
  .then(responseObject => responseObject.json())
  .then(response => {
    console.log(response.telesession);
  })
  .catch((err) => {
    console.error(err);
  });
}

var Telesession = React.createClass({
  render: function () {
    return (
      <button onClick={createSession}><h1>Create Session</h1></button>
    );
  }
});

export default Telesession;
