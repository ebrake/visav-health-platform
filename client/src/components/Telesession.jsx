import React, { Component } from 'react';

const createSession = (arg) => {
  fetch(
    'http://localhost:4000/api/telesessions/createSession', 
    {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) 
    }
  )
  .then(function(response){
    console.log('ok');
    console.log(response);
  })
}

var Telesession = React.createClass({
  render: function () {
    return (
      <button onClick={createSession}><h1>Create Session</h1></button>
    );
  }
});

export default Telesession;
